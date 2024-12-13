// controllers/jobController.js
const JobPosting = require('../models/JobPosting');
const { getPagination } = require('../utils/pagination');
const mongoose = require('mongoose');

/**
 * 공고 목록 조회 (필터링, 정렬, 페이지네이션 포함)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobListings = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    location, // 지역 필터
    experience, // 경력 필터
    techStack, // 기술 스택 필터
    keyword, // 키워드 검색
    company, // 회사명 필터
    jobTitle, // 직무명 필터
  } = req.query;

  try {
    const filter = {};
    if (company) filter.company = company;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (experience) filter.experience = experience;
    if (techStack) filter.techStack = { $in: techStack.split(',') };
    if (keyword) filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' };

    const jobListings = await JobPosting.find(filter)
      .populate('company', 'name') // 회사명 포함
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await JobPosting.countDocuments(filter);

    res.status(200).json({
      data: jobListings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 공고 상세 조회
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await JobPosting.findById(id).populate('company', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 채용 공고 생성
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.createJobPosting = async (req, res) => {
  try {
    const { company } = req.user; // 인증된 사용자의 회사 정보
    console.log('Authenticated user:', req.user); // 추가된 로그

    if (!company) {
      return res.status(400).json({ status: 'error', message: 'Company information is missing.' });
    }

    const {
      title,
      description,
      location,
      experience,
      techStack,
      jobTitle,
      ...otherFields
    } = req.body;

    // techStack을 배열로 변환 (쉼표로 구분된 문자열인 경우)
    const techStackArray = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack;

    const job = new JobPosting({
      title,
      description,
      location,
      experience,
      techStack: techStackArray,
      jobTitle,
      company: company._id, // 회사 ID 설정
      ...otherFields,
    });

    await job.save();
    res.status(201).json({ status: 'success', data: job });
  } catch (error) {
    console.error('Create Job Posting Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

/**
 * 채용 공고 수정
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.updateJobPosting = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const { _id, company, ...updateFields } = req.body;

    // techStack을 배열로 변환 (필요 시)
    if (updateFields.techStack && typeof updateFields.techStack === 'string') {
      updateFields.techStack = updateFields.techStack.split(',').map(s => s.trim());
    }

    const job = await JobPosting.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

/**
 * 채용 공고 삭제
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.deleteJobPosting = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const job = await JobPosting.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

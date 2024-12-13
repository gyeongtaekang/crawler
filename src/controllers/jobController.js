const JobPosting = require('../models/JobPosting');
const { getPagination } = require('../utils/pagination');
const Company = require('../models/Company');
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
      .limit(limit);

    res.status(200).json({
      data: jobListings,
      page,
      limit,
      total: await JobPosting.countDocuments(filter),
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
 * 지역별 공고 수 조회
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobSummaryByLocation = async (req, res) => {
  try {
    const summary = await JobPosting.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

/**
 * 인기 공고 조회 (페이지네이션 포함)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getPopularJobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const { skip, limit: parsedLimit } = getPagination(page, limit); // 페이지네이션 계산

    const popularJobs = await JobPosting.find({ approved: true })
      .sort({ views: -1 }) // 조회수가 많은 순으로 정렬
      .skip(skip) // 페이지네이션을 위한 skip
      .limit(parsedLimit) // 페이지네이션을 위한 limit
      .populate('company', 'name'); // 회사명 포함

    const total = await JobPosting.countDocuments({ approved: true });

    res.status(200).json({
      data: popularJobs,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
};

/**
 * 채용 공고 생성
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.createJobPosting = async (req, res) => { // 함수 이름 변경
  try {
    const job = new JobPosting(req.body);
    await job.save();
    res.status(201).json({ status: 'success', data: job });
  } catch (error) {
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
    const job = await JobPosting.findByIdAndUpdate(id, req.body, { new: true });
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

// controllers/jobController.js

const JobPosting = require('../models/JobPosting');

// 채용 공고 목록 조회(검색, 필터링, 페이지네이션, 정렬)
exports.getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, location, experience, sort } = req.query;

    const query = {};

    // 검색 조건
    if (search) {
      query.$text = { $search: search };
    }

    // 필터 조건
    if (location) {
      query.location = location;
    }
    if (experience) {
      query.experience = experience;
    }

    // 정렬 조건
    const sortOption = {};
    if (sort) {
      sortOption[sort] = -1; 
    } else {
      sortOption.createdAt = -1;
    }

    const jobs = await JobPosting.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await JobPosting.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 채용 공고 상세 조회
exports.getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }
    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    next(error);
  }
};

// 채용 공고 등록 (관리자 전용)
exports.createJobPosting = async (req, res, next) => {
  try {
    const { companyName, title, link, location, experience } = req.body;
    const job = new JobPosting({ companyName, title, link, location, experience });
    await job.save();
    res.status(201).json({ message: '채용공고 등록 성공', data: job });
  } catch (error) {
    next(error);
  }
};

// 채용 공고 수정 (관리자 전용)
exports.updateJobPosting = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;
    const job = await JobPosting.findByIdAndUpdate(jobId, updateData, { new: true });
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '채용공고 수정 성공', data: job });
  } catch (error) {
    next(error);
  }
};

// 채용 공고 삭제 (관리자 전용)
exports.deleteJobPosting = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await JobPosting.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '채용공고 삭제 성공' });
  } catch (error) {
    next(error);
  }
};

// 데이터 집계 API (예: location별 채용공고 수 집계)
exports.getJobStats = async (req, res, next) => {
  try {
    const stats = await JobPosting.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

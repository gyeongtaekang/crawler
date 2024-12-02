// controllers/jobController.js

const JobPosting = require('../models/JobPosting');

// 채용 공고 목록 조회
exports.getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, location, experience, sort } = req.query;

    const query = {};

    // 검색 조건 추가
    if (search) {
      query.$text = { $search: search };
    }

    // 필터링 조건 추가
    if (location) {
      query.location = location;
    }
    if (experience) {
      query.experience = experience;
    }

    // 정렬 조건 설정
    const sortOption = {};
    if (sort) {
      sortOption[sort] = -1; // 내림차순 정렬
    } else {
      sortOption.createdAt = -1; // 기본 정렬: 최신순
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

    // 조회수 증가 로직 등 추가 가능

    res.status(200).json({
      status: 'success',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// (필요 시) 채용 공고 등록/수정/삭제 함수 구현

// controllers/jobController.js

const JobPosting = require('../models/JobPosting');

exports.getJobs = async (req, res, next) => {
  try {
    // query 파라미터 받기
    const { page = 1, limit = 20, search, location, experience, sort } = req.query;

    const query = {};

    // 텍스트 검색 (search 파라미터가 있으면 $text 검색)
    if (search) {
      query.$text = { $search: search };
    }

    // 필터링 조건: location, experience 정확 일치
    if (location) {
      // 정확히 "서울 강남구" 라고 DB에 저장되어 있다면 location=서울 강남구 로 필터링해야 함
      // 부분 매치를 원하면:
      // query.location = { $regex: location, $options: 'i' }; 
      // 이렇게 하면 location이 "서울"만 넣어도 "서울 강남구" 매칭 가능
      query.location = location;
    }

    if (experience) {
      query.experience = experience;
    }

    // 정렬 조건 설정
    const sortOption = {};
    if (sort) {
      // 지정된 필드 기준 내림차순
      sortOption[sort] = -1; 
    } else {
      // 기본적으로 createdAt 기준 최신순
      sortOption.createdAt = -1; 
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const jobs = await JobPosting.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await JobPosting.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: jobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 상세조회 API (필요 시)
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

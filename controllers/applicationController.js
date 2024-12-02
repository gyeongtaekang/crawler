// controllers/applicationController.js

const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');

// 지원하기
exports.applyForJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobPostingId } = req.body;

    // 이미 지원했는지 확인
    const existingApplication = await Application.findOne({ user: userId, jobPosting: jobPostingId });
    if (existingApplication) {
      return res.status(400).json({ message: '이미 지원한 공고입니다.' });
    }

    // 지원 정보 저장
    const application = new Application({
      user: userId,
      jobPosting: jobPostingId,
    });
    await application.save();

    res.status(201).json({ message: '지원이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 지원 내역 조회
exports.getApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ user: userId })
      .populate('user', 'name email')
      .populate('jobPosting');

    res.status(200).json({
      status: 'success',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// 지원 취소
exports.cancelApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;

    const application = await Application.findOne({ _id: applicationId, user: userId });

    if (!application) {
      return res.status(404).json({ message: '지원 내역을 찾을 수 없습니다.' });
    }

    // 지원 상태 변경 또는 삭제
    await Application.deleteOne({ _id: applicationId });

    res.status(200).json({ message: '지원이 취소되었습니다.' });
  } catch (error) {
    next(error);
  }
};

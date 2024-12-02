// controllers/applicationController.js

const Application = require('../models/Application');

// 지원 내역 조회
exports.getApplications = async (req, res, next) => {
  try {
    // 현재 인증된 사용자 ID
    const userId = req.user.id;

    // 지원 내역 조회 및 연관된 사용자, 채용 공고 정보 함께 가져오기
    const applications = await Application.find({ user: userId })
      .populate('user', 'name email') // 필요한 사용자 필드만 선택
      .populate('jobPosting'); // 채용 공고 전체 정보

    res.status(200).json({
      status: 'success',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

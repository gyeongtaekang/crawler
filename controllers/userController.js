// controllers/userController.js

const User = require('../models/User');

// 회원 정보 조회
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password'); // 비밀번호 필드 제외

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 추가 기능 구현 가능 (회원 탈퇴 등)

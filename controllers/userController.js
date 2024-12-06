// controllers/userController.js

const User = require('../models/User');

// 회원 정보 조회
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// 회원 탈퇴
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '회원 탈퇴 완료' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserInfo: (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: '사용자 정보가 없습니다. 인증이 필요합니다.' });
    }

    // req.user에서 필요한 데이터 추출
    const { id, name, email, isAdmin } = req.user;

    // 사용자 정보 반환
    res.json({
      id,        // 사용자 ID
      name,      // 사용자 이름
      email,     // 사용자 이메일
      isAdmin    // 관리자 여부
    });
  },
  deleteUser: (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: '사용자 정보가 없습니다. 인증이 필요합니다.' });
    }

    res.json({ message: `ID ${req.user.id} 사용자가 삭제되었습니다.` });
  }
};

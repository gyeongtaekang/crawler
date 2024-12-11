// controllers/userController.js
const User = require('../models/User');

// 사용자 프로필 조회
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

// 사용자 삭제 (회원 탈퇴)
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: `ID ${userId} 사용자가 삭제되었습니다.` });
  } catch (error) {
    next(error);
  }
};

// 사용자 프로필 수정
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({ message: '프로필이 성공적으로 수정되었습니다.', user });
  } catch (error) {
    next(error);
  }
};

// 사용자 정보 반환
exports.getUserInfo = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '사용자 정보가 없습니다. 인증이 필요합니다.' });
  }

  const { id, name, email, isAdmin } = req.user;

  res.json({
    id,
    name,
    email,
    isAdmin
  });
};

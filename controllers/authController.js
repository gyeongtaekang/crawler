// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// 회원가입
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 이메일 형식 및 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    // 비밀번호 해싱은 User 모델에서 pre-save 훅으로 처리됨
    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    next(error);
  }
};

// 로그인
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 사용자 인증
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 발급
    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // (선택) Refresh Token 발급 및 저장 로직 추가 가능

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// 토큰 갱신 (Refresh Token 사용 시)
// Refresh Token 관리 로직이 필요한 경우 추가 구현 필요
exports.refreshToken = (req, res, next) => {
  // 구현 예시
};

// 회원 정보 수정
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      updateData.password = hashed;
    }

    await User.findByIdAndUpdate(userId, updateData);

    res.status(200).json({ message: '회원 정보가 수정되었습니다.' });
  } catch (error) {
    next(error);
  }
};


const { validationResult } = require('express-validator');

// 회원가입
exports.register = async (req, res, next) => {
  // 입력 데이터 검증 결과 확인
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 나머지 회원가입 로직...
};
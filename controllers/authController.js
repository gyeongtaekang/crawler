// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { validationResult } = require('express-validator');

// 회원가입
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const payload = { id: user._id, isAdmin: user.isAdmin || false };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

    // 토큰 반환
    res.status(200).json({
      message: '로그인 성공',
      accessToken: accessToken,
      tokenType: 'Bearer',
      authorization: `Bearer ${accessToken}`
    });
  } catch (error) {
    next(error);
  }
};


// 토큰 갱신 (Refresh Token 사용 시 필요)
exports.refreshToken = (req, res, next) => {
  // 구현 예시
};

// 회원 정보 수정
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      // 비밀번호 재해싱 + base64
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const base64Hashed = Buffer.from(hashed, 'utf-8').toString('base64');
      updateData.password = base64Hashed;
    }

    await User.findByIdAndUpdate(userId, updateData);
    res.status(200).json({ message: '회원 정보가 수정되었습니다.' });
  } catch (error) {
    next(error);
  }
};

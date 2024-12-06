// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { validationResult } = require('express-validator');

// 회원가입 함수
exports.register = async (req, res, next) => {
  try {
    // express-validator 결과 확인 (유효성 검사)
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // 필드 확인
    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이미 존재하는 이메일 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호는 모델의 pre-save 훅에서 Base64 인코딩 처리
    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 로그인 함수
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('로그인 시도:', email);

    // 사용자 조회
    const user = await User.findOne({ email });
    if (!user) {
      console.log('사용자 없음:', email);
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 비교 (Base64 디코딩 후 평문 비교)
    const isMatch = user.comparePassword(password);
    console.log('비밀번호 일치 여부:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    try {
      const payload = { id: user._id, isAdmin: user.isAdmin || false };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

      res.header('Authorization', `Bearer ${accessToken}`);
      res.status(200).json({
        message: '로그인 성공',
        accessToken: accessToken,
        tokenType: 'Bearer',
        authorization: `Bearer ${accessToken}`
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// 비밀번호 재설정 함수
exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, newPassword } = req.body;

    // 사용자 조회
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 업데이트 (pre-save 훅에서 Base64 인코딩 처리)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 기타 함수들 (refreshToken, updateProfile 등)

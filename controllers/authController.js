const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { validationResult } = require('express-validator');

// 회원가입 함수
exports.register = async (req, res, next) => {
  try {
    // express-validator 결과 확인
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

    // 사용자 생성 및 저장
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
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 사용자 조회
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 비교
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const payload = { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin || false };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'
    });

    const bearerToken = `Bearer ${accessToken}`;

    res.header('Authorization', bearerToken);
    res.status(200).json({
      message: '로그인 성공',
      tokenType: 'Bearer',
      accessToken: accessToken, // Bearer가 붙지 않은 토큰
      bearerToken: bearerToken  // Bearer가 붙은 토큰
    });
  } catch (error) {
    next(error);
  }
};

// 비��번호 재설정 함수
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

    // 비밀번호 업데이트
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// JWT 리프레시 토큰 함수
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: '리프레시 토큰이 필요합니다.' });
  }

  try {
    // 리프레시 토큰 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, name: decoded.name, email: decoded.email, isAdmin: decoded.isAdmin };

    // 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'
    });

    res.status(200).json({
      message: '새로운 액세스 토큰이 발급되었습니다.',
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
  }
};

// 사용자 프로필 업데이트 함수
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // 사용자 조회
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 업데이트 가능한 필드 설정
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({ message: '프로필이 업데이트되었습니다.', user });
  } catch (error) {
    next(error);
  }
};

// JWT 생성 함수
exports.generateToken = (req, res) => {
  const { id, name, email, isAdmin } = req.body;

  // JWT 생성
  const token = jwt.sign(
    { id, name, email, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

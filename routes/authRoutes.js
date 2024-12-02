// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입
router.post('/register', authController.register);

// 로그인
router.post('/login', authController.login);

// 토큰 갱신
router.post('/refresh', authController.refreshToken);

// 회원 정보 수정 (인증 필요)
router.put('/profile', authController.updateProfile);

const { body } = require('express-validator');

// 회원가입 시 데이터 검증
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
    body('name').notEmpty().withMessage('이름을 입력하세요.'),
  ],
  authController.register
);

module.exports = router;

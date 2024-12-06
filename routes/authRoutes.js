// routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입 - 데이터 검증
router.post('/register', 
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 6자리 이상이어야 합니다.'),
    body('name').notEmpty().withMessage('이름을 입력하세요.')
  ],
  authController.register
);

// 로그인 - 데이터 검증
router.post('/login',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력하세요.')
  ],
  authController.login
);

// 비밀번호 재설정 라우트 추가
router.post('/reset-password',
    [
      body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
      body('newPassword').isLength({ min: 6 }).withMessage('비밀번호는 6자리 이상이어야 합니다.')
    ],
    authController.resetPassword
  );

module.exports = router;

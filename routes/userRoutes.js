// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// 인증 미들웨어 적용
router.use(authMiddleware);

// 회원 정보 조회
router.get('/profile', userController.getProfile);

// 회원 탈퇴 등 추가 기능 구현 가능

module.exports = router;

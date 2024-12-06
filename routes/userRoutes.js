// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// 인증 필요
router.use(authMiddleware());

// 회원 정보 조회
router.get('/profile', userController.getProfile);

// 회원 탈퇴
router.delete('/me', userController.deleteUser);

module.exports = router;

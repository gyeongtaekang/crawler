// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// 인증 미들웨어 적용 (올바르게 호출)
router.use(authMiddleware());

// 내 정보 조회
router.get('/me', userController.getProfile);

// 계정 삭제
router.delete('/me', userController.deleteUser);

// 사용자 정보 수정
router.put('/profile', userController.updateProfile);

module.exports = router;

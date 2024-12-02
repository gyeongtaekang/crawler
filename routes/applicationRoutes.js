// routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/auth');

// 인증 미들웨어 적용
router.use(authMiddleware);

// 지원하기
router.post('/', applicationController.applyForJob);

// 지원 내역 조회
router.get('/', applicationController.getApplications);

// 지원 취소
router.delete('/:id', applicationController.cancelApplication);

module.exports = router;

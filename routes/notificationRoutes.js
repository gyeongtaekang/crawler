// routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

// 인증 미들웨어 적용 (올바르게 호출)
router.use(authMiddleware());

// 알림 목록 조회
router.get('/', notificationController.getNotifications);

// 알림 읽음 처리
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;

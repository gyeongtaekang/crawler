// routes/bookmarkRoutes.js

const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/auth');

// 인증 미들웨어 적용
router.use(authMiddleware);

// 북마크 추가/제거
router.post('/', bookmarkController.toggleBookmark);

// 북마크 목록 조회
router.get('/', bookmarkController.getBookmarks);

module.exports = router;

// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // auth 미들웨어 불러오기

// 내 정보 조회
router.get('/me', auth(), userController.getUserInfo);

// 계정 삭제
router.delete('/me', auth(), userController.deleteUser);

module.exports = router;

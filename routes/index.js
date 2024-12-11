// routes/index.js
// 전체 코드 제공, 주석 생략 없음

const express = require('express');
const router = express.Router();
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const authRoutes = require('./authRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const notificationRoutes = require('./notificationRoutes');
const userRoutes = require('./userRoutes');

// /jobs 라우트
router.use('/jobs', jobRoutes);

// /applications 라우트
router.use('/applications', applicationRoutes);

// /auth 라우트
router.use('/auth', authRoutes);

// /bookmarks 라우트
router.use('/bookmarks', bookmarkRoutes);

// /notifications 라우트
router.use('/notifications', notificationRoutes);

// /users 라우트
router.use('/users', userRoutes);

module.exports = router;

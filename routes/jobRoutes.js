// routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// 채용 공고 목록 조회
router.get('/', jobController.getJobs);

// 채용 공고 상세 조회
router.get('/:id', jobController.getJobById);

// (필요 시) 채용 공고 등록/수정/삭제 - 인증 및 권한 필요
// router.post('/', authMiddleware, jobController.createJob);
// router.put('/:id', authMiddleware, jobController.updateJob);
// router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;

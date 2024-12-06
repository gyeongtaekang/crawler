// routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/auth');

// 데이터 집계 API
router.get('/stats/aggregate', jobController.getJobStats);

// 채용 공고 목록 조회(필터링, 검색, 페이지네이션, 정렬)
router.get('/', jobController.getJobs);

// 채용 공고 상세 조회
router.get('/:id', jobController.getJobById);

// 관리자 전용 채용 공고 관리
router.post('/', auth(true), jobController.createJobPosting);
router.put('/:id', auth(true), jobController.updateJobPosting);
router.delete('/:id', auth(true), jobController.deleteJobPosting);

module.exports = router;

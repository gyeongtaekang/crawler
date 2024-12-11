// routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// GET /jobs - 검색, 필터, 페이지네이션, 정렬
// 예: GET http://localhost:443/jobs?search=데이터&location=서울 강남구&sort=createdAt&page=1&limit=10
router.get('/', jobController.getJobs);

// GET /jobs/:id - 특정 공고 상세 조회
router.get('/:id', jobController.getJobById);

module.exports = router;

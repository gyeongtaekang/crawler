const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 가져오기
const {
  getJobListings,
  getJobDetails,
  createJobPosting, // createJob 제거
  updateJobPosting,
  deleteJobPosting,
  getPopularJobs,
} = require('../controllers/jobController'); // createJob 제거

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 공고 목록 조회, 필터링, 정렬, 페이지네이션
 *     description: 필터링, 정렬, 페이지네이션을 지원하는 공고 목록을 조회합니다.
 *     tags: [Job Postings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: 지역 필터링(ex. 서울 강남구, 서울 강북구)
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터링(신입, 1, 3, 5, 10년 이상)
 *       - in: query
 *         name: techStack
 *         schema:
 *           type: string
 *         description: 기술 스택 필터링 (쉼표로 구분)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명 키워드 검색 ('(주)' 제외하고 검색)
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: 회사 이름 검색
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: 포지션 검색 (정규직, 계약직)
 *     responses:
 *       200:
 *         description: 공고 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: 서버 오류
 */
// 공고 목록 조회
router.get('/', authMiddleware, getJobListings);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 채용 공고 검색
 *     description: 특정 공고의 상세 정보를 조회합니다.
 *     tags: [Job Postings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 채용공고 ID
 *     responses:
 *       200:
 *         description: 채용 공고 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/JobPosting'
 *                 relatedJobs:
 *                   type: array
 *                   description: '관련 공고 목록'
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 공고 상세 조회
router.get('/:id', authMiddleware, getJobDetails);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: 채용 공고 등록
 *     description: 새로운 채용 공고를 등록합니다.
 *     tags: [Job Postings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPosting'
 *     responses:
 *       201:
 *         description: 채용 공고 등록 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 채용 공고 등록
router.post('/', authMiddleware, createJobPosting);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: 채용 공고 수정
 *     description: 기존 채용 공고를 수정합니다.
 *     tags: [Job Postings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공고 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPosting'
 *     responses:
 *       200:
 *         description: 채용 공고 수정 성공
 *       404:
 *         description: 공고를 찾을 수 없음
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 채용 공고 수정
router.put('/:id', authMiddleware, updateJobPosting);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: 채용 공고 삭제
 *     description: 기존 채용 공고를 삭제합니다.
 *     tags: [Job Postings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공고 ID
 *     responses:
 *       200:
 *         description: 채용 공고 삭제 성공
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 채용 공고 삭제
router.delete('/:id', authMiddleware, deleteJobPosting);

/**
 * @swagger
 * /jobs/popular:
 *   get:
 *     summary: 인기 공고 조회
 *     description: 조회수가 높은 인기 공고를 조회합니다.
 *     tags: [Job Postings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 인기 공고 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: 서버 오류
 */
// 인기 공고 조회
router.get('/popular', getPopularJobs);

module.exports = router;

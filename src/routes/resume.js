const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createResume, getResumes, deleteResume } = require('../controllers/resumeController');
const router = express.Router();

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: 지원서 작성
 *     description: "새로운 기회를 향한 첫걸음! 사용자가 자신만의 지원서를 작성합니다. 지원서를 통해 여러분의 열정을 보여주세요!"
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "지원서 제목 (열정이 담긴 제목을 작성하세요)"
 *                 example: "백엔드 개발자 지원서"
 *               content:
 *                 type: string
 *                 description: "지원서 내용 (여러분의 강점과 경험을 어필해보세요)"
 *                 example: "저는 백엔드 개발 경험이 5년 이상이며, Node.js와 MongoDB를 활용한 다양한 프로젝트를 성공적으로 수행하였습니다..."
 *     responses:
 *       201:
 *         description: "지원서 작성 성공! 꿈을 향한 한 걸음을 내딛으셨습니다!"
 *       500:
 *         description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
 */
router.post('/', authMiddleware, createResume);

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: 지원서 조회
 *     description: "내가 작성한 지원서를 조회하고, 지금까지의 도전과 경험을 돌아볼 수 있습니다."
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "지원서 조회 성공! 여러분의 열정적인 도전이 기록되어 있습니다!"
 *       500:
 *         description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
 */
router.get('/', authMiddleware, getResumes);

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: 지원서 삭제
 *     description: "더 나은 기회를 위해 기존 지원서를 삭제합니다. 다음 도전을 위해 준비하세요!"
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "삭제할 지원서의 ID"
 *     responses:
 *       200:
 *         description: "지원서 삭제 성공! 새로운 도전이 기다리고 있습니다!"
 *       404:
 *         description: "해당 지원서를 찾을 수 없습니다. 다시 확인해주세요."
 *       500:
 *         description: "서버 오류가 발생했습니다. 관리자에게 문의하세요."
 */
router.delete('/:id', authMiddleware, deleteResume);

module.exports = router;

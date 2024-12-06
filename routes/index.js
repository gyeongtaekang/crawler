const express = require('express');
const router = express.Router();

// 컨트롤러 파일 불러오기
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const bookmarkController = require('../controllers/bookmarkController');

// 인증 미들웨어 불러오기
const auth = require('../middlewares/auth');

// 컨트롤러 존재 여부 확인
if (!authController || !userController || !jobController || !applicationController || !bookmarkController) {
  console.error('컨트롤러 파일 경로를 확인하세요.');
}

// ====================== Auth Routes ======================

// 회원가입
router.post('/auth/register', authController?.register || ((req, res) => res.status(500).send('Register 함수 없음')));

// 로그인
router.post('/auth/login', authController?.login || ((req, res) => res.status(500).send('Login 함수 없음')));

// ====================== User Routes ======================

// 내 정보 조회
router.get('/users/me', auth(), userController?.getUserInfo || ((req, res) => res.status(500).send('getUserInfo 함수 없음')));

// 계정 삭제
router.delete('/users/me', auth(), userController?.deleteUser || ((req, res) => res.status(500).send('deleteUser 함수 없음')));

// ====================== Job Routes ======================

// 채용 공고 생성 (관리자 권한 필요)
router.post('/jobs', auth(true), jobController?.createJobPosting || ((req, res) => res.status(500).send('createJobPosting 함수 없음')));

// 채용 공고 수정 (관리자 권한 필요)
router.put('/jobs/:id', auth(true), jobController?.updateJobPosting || ((req, res) => res.status(500).send('updateJobPosting 함수 없음')));

// 채용 공고 삭제 (관리자 권한 필요)
router.delete('/jobs/:id', auth(true), jobController?.deleteJobPosting || ((req, res) => res.status(500).send('deleteJobPosting 함수 없음')));

// 채용 공고 조회
router.get('/jobs', jobController?.getJobPostings || ((req, res) => res.status(500).send('getJobPostings 함수 없음')));

// 채용 공고 검색
router.get('/jobs/search', jobController?.searchJobPostings || ((req, res) => res.status(500).send('searchJobPostings 함수 없음')));

// 채용 공고 필터링
router.get('/jobs/filter', jobController?.filterJobPostings || ((req, res) => res.status(500).send('filterJobPostings 함수 없음')));

// ====================== Application Routes ======================

// 채용 공고 지원
router.post('/applications', auth(), applicationController?.applyJob || ((req, res) => res.status(500).send('applyJob 함수 없음')));

// 지원 취소
router.delete('/applications/:id', auth(), applicationController?.cancelApplication || ((req, res) => res.status(500).send('cancelApplication 함수 없음')));

// 내가 지원한 공고 조회
router.get('/applications/me', auth(), applicationController?.getMyApplications || ((req, res) => res.status(500).send('getMyApplications 함수 없음')));

// ====================== Bookmark Routes ======================

// 북마크 추가
router.post('/bookmarks', auth(), bookmarkController?.addBookmark || ((req, res) => res.status(500).send('addBookmark 함수 없음')));

// ====================== 기본 경로 ======================

// 기본 페이지
router.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 예제 라우트
router.get('/example', (req, res) => {
  res.send('Example route');
});

module.exports = router;

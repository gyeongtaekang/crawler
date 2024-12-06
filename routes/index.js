// routes/index.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const bookmarkController = require('../controllers/bookmarkController');
const auth = require('../middlewares/auth');

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// User
router.get('/users/me', auth(), userController.getUserInfo);
router.delete('/users/me', auth(), userController.deleteUser);

// Job Postings
router.post('/jobs', auth(true), jobController.createJobPosting); // 관리자 권한 필요
router.put('/jobs/:id', auth(true), jobController.updateJobPosting); // 관리자 권한 필요
router.delete('/jobs/:id', auth(true), jobController.deleteJobPosting); // 관리자 권한 필요

router.get('/jobs', jobController.getJobPostings);
router.get('/jobs/search', jobController.searchJobPostings);
router.get('/jobs/filter', jobController.filterJobPostings);

// Application
router.post('/applications', auth(), applicationController.applyJob);
router.delete('/applications/:id', auth(), applicationController.cancelApplication);
router.get('/applications/me', auth(), applicationController.getMyApplications);

// Bookmark
router.post('/bookmarks', auth(), bookmarkController.addBookmark);

module.exports = router;

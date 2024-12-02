// app.js

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// 미들웨어 설정
app.use(cors()); // CORS 미들웨어 설정
app.use(express.json()); // JSON 파싱 미들웨어 설정

// 데이터베이스 연결
const connectDB = require('./config/db');
connectDB();

// 라우트 설정
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

// 에러 핸들러 미들웨어
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

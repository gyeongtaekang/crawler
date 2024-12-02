// app.js 또는 server.js

const express = require('express');
const app = express();

// 기타 필요한 미들웨어 설정 (body-parser, cors 등)
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

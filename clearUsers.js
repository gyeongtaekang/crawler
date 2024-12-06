// scripts/clearUsers.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const clearUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    console.log('모든 사용자가 삭제되었습니다.');
    process.exit(0);
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    process.exit(1);
  }
};

clearUsers();

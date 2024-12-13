// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: { // Refresh Token 필드 추가
    type: String,
    default: null,
  },
  company: { // 회사 필드 추가
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false, // 필요에 따라 true로 설정
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

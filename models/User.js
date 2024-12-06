// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 비밀번호 해싱 + Base64 인코딩 추가(요구사항 반영)
// bcrypt로 해시한 후 base64로 인코딩 (추가된 요구사항 반영)
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    const base64Hashed = Buffer.from(hashed, 'utf-8').toString('base64');
    this.password = base64Hashed;
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드 (복호화 후 bcrypt 비교)
UserSchema.methods.comparePassword = async function (inputPassword) {
  const hashedBase64 = this.password;
  const hashed = Buffer.from(hashedBase64, 'base64').toString('utf-8');
  return bcrypt.compare(inputPassword, hashed);
};

module.exports = mongoose.model('User', UserSchema);

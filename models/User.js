// models/User.js

const mongoose = require('mongoose');

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

// 비밀번호를 Base64로 인코딩하여 저장
UserSchema.pre('save', function (next) {
  try {
    // 비밀번호가 변경된 경우에만 인코딩
    if (!this.isModified('password')) {
      return next();
    }
    // 비밀번호를 Base64로 인코딩
    const base64Encoded = Buffer.from(this.password, 'utf-8').toString('base64');
    this.password = base64Encoded;
    console.log(`비밀번호 인코딩 완료: ${this.password}`);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드 (Base64 디코딩 후 비교)
UserSchema.methods.comparePassword = function (inputPassword) {
  // DB에 저장된 비밀번호 Base64 디코딩
  const storedBase64 = this.password;
  const decodedPassword = Buffer.from(storedBase64, 'base64').toString('utf-8');

  console.log(`디코딩된 비밀번호: ${decodedPassword}`);
  console.log(`입력된 비밀번호: ${inputPassword}`);

  // 평문 비밀번호 비교
  return decodedPassword === inputPassword;
};

module.exports = mongoose.model('User', UserSchema);

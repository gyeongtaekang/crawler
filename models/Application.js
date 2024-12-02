const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
    status: {
      type: String,
      enum: ['지원 완료', '검토 중', '합격', '불합격', '취소'],
      default: '지원 완료',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    // 추가 필드 (예: 이력서, 자기소개서 등)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);

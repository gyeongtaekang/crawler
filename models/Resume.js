const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    content: String,
    // 파일 업로드를 위한 필드 등
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);

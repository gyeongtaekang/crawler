// models/JobPosting.js

const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema(
  {
    companyName: String,
    title: String,
    link: {
      type: String,
      unique: true,
    },
    location: String,
    experience: String,
    education: String,
    employmentType: String,
    dueDate: String,
    jobSector: String,
    salary: String,
  },
  { timestamps: true }
);

// 텍스트 인덱스 설정 (검색용)
JobPostingSchema.index({ title: 'text', companyName: 'text' });

// 복합 인덱스 설정 (필터링, 정렬용)
JobPostingSchema.index({ location: 1, experience: 1 });

module.exports = mongoose.model('JobPosting', JobPostingSchema);

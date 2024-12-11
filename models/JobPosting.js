// models/JobPosting.js

const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema(
  {
    link: String,
    companyName: String,
    dueDate: String,
    experience: String,
    location: String,
    salary: String,
    scraped_at: Date,
    tags: Array,
    title: String
  },
  { timestamps: true }
);

// 텍스트 인덱스 설정: title, companyName에 대해 텍스트 검색
JobPostingSchema.index({ title: 'text', companyName: 'text' });

// 필요에 따라 location, experience 인덱스를 추가할 수도 있음
// JobPostingSchema.index({ location: 1, experience: 1 });

module.exports = mongoose.model('JobPosting', JobPostingSchema);

const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    industry: String,
    location: String,
    description: String,
    website: String,
    // 추가 회사 정보 필드
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', CompanySchema);

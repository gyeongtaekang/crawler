// models/Company.js

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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', CompanySchema);

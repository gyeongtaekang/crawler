// models/Resume.js

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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);

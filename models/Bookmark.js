const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('Bookmark', BookmarkSchema);

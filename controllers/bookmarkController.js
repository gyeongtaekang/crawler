// controllers/bookmarkController.js

const Bookmark = require('../models/Bookmark');

exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobPostingId } = req.body;

    const existing = await Bookmark.findOne({ user: userId, jobPosting: jobPostingId });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      res.status(200).json({ message: '북마크가 제거되었습니다.' });
    } else {
      const bookmark = new Bookmark({ user: userId, jobPosting: jobPostingId });
      await bookmark.save();
      res.status(201).json({ message: '북마크가 추가되었습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.find({ user: userId }).populate('jobPosting');
    res.status(200).json({ status: 'success', data: bookmarks });
  } catch (error) {
    next(error);
  }
};

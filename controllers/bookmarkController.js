// controllers/bookmarkController.js

const Bookmark = require('../models/Bookmark');

// 북마크 추가/제거
exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobPostingId } = req.body;

    // 북마크 존재 여부 확인
    const existingBookmark = await Bookmark.findOne({ user: userId, jobPosting: jobPostingId });

    if (existingBookmark) {
      // 북마크 제거
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.status(200).json({ message: '북마크가 제거되었습니다.' });
    } else {
      // 북마크 추가
      const bookmark = new Bookmark({
        user: userId,
        jobPosting: jobPostingId,
      });
      await bookmark.save();
      res.status(201).json({ message: '북마크가 추가되었습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

// 북마크 목록 조회
exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookmarks = await Bookmark.find({ user: userId }).populate('jobPosting');

    res.status(200).json({
      status: 'success',
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

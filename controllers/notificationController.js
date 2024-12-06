// controllers/notificationController.js

const Notification = require('../models/Notification');

// 알림 조회
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user: userId });
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
};

// 알림 읽기 처리
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
      return res.status(404).json({ message: '알림을 찾을 수 없습니다.' });
    }

    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: '알림을 읽음 처리했습니다.' });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    // 추가 필드 (예: 알림 유형 등)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);

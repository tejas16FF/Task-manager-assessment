const Notification = require("../models/Notification");

async function createNotification(payload) {
  if (!payload.recipient) {
    return null;
  }

  return Notification.create(payload);
}

async function getUserNotifications(userId, limit = 25) {
  return Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

async function markNotificationAsRead(notificationId) {
  return Notification.findByIdAndUpdate(
    notificationId,
    {
      read: true,
    },
    {
      new: true,
    }
  );
}

async function markAllNotificationsAsRead(userId) {
  return Notification.updateMany(
    {
      recipient: userId,
      read: false,
    },
    {
      read: true,
    }
  );
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
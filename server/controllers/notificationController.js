const notificationService = require("../services/notification.service");

const getNotifications = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const notifications =
      await notificationService.getUserNotifications(
        req.user.id,
        page,
        limit
      );

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification =
      await notificationService.markNotificationAsRead(
        req.params.id
      );

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllNotificationsAsRead(
      req.user.id
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
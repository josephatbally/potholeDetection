const Notification = require('../models/Notification');
const { sendAlert } = require('../services/alertService');

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, target, relatedPothole } = req.body;
    const notification = new Notification({
      title,
      message,
      type,
      target: target || 'all',
      relatedPothole,
    });
    await notification.save();

    // Emit real‑time event via Socket.IO
    sendAlert('notification', {
      title,
      message,
      type,
      target,
      notificationId: notification._id,
      createdAt: notification.createdAt,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { target, limit = 50 } = req.query;
    const filter = {};
    if (target) filter.target = { $in: [target, 'all'] };
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { sensorId } = req.body;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ error: 'Not found' });
    if (!notification.readBy.includes(sensorId)) {
      notification.readBy.push(sensorId);
      await notification.save();
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

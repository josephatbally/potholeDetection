const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'resolved', 'urgent', 'success', 'road_closed', 'general', 'repair_done'],
    default: 'info',
  },
  target: {
    type: String,
    enum: ['all', 'citizens', 'authorities'],
    default: 'all',
  },
  relatedPothole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pothole',
    default: null,
  },
  readBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

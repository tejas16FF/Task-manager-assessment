const mongoose = require("mongoose");
const { NOTIFICATION_TYPES } = require("../constants");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  read: {
    type: Boolean,
    default: false,
  },

  readAt: {
    type: Date,
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ task: 1, createdAt: -1 });
notificationSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);

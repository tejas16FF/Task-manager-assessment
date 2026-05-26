const mongoose = require("mongoose");
const { ACTIVITY_ACTIONS } = require("../constants");

const activitySchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  action: {
    type: String,
    enum: Object.values(ACTIVITY_ACTIONS),
    required: true,
  },

  entityType: {
    type: String,
    enum: ["project", "task", "user", "comment", "attachment"],
    required: true,
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ task: 1, createdAt: -1 });
activitySchema.index({ actor: 1, createdAt: -1 });
activitySchema.index({ targetUser: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);

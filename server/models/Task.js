const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Kept for older task records that used description before remarks existed.
  description: {
    type: String,
    default: "",
  },

  remarks: {
    type: String,
    default: "",
    trim: true,
  },

  project: {
    type: String,
    default: "General",
    trim: true,
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },

  completed: {
    type: Boolean,
    default: false,
  },

  dueDate: {
    type: String,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Task", taskSchema);

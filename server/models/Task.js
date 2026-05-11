const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  priority: {
    type: String,
    default: "Medium",
  },

  completed: {
    type: Boolean,
    default: false,
  },

  dueDate: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Task", taskSchema);
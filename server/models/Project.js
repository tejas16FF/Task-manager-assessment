const mongoose = require("mongoose");
const { PROJECT_STATUS, TASK_PRIORITY } = require("../constants");

const projectMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "manager", "member"],
    default: "member",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  _id: false,
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  key: {
    type: String,
    uppercase: true,
    trim: true,
    sparse: true,
    index: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  status: {
    type: String,
    enum: Object.values(PROJECT_STATUS),
    default: PROJECT_STATUS.ACTIVE,
  },

  priority: {
    type: String,
    enum: Object.values(TASK_PRIORITY),
    default: TASK_PRIORITY.MEDIUM,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  members: [projectMemberSchema],

  startDate: {
    type: Date,
  },

  dueDate: {
    type: Date,
  },

  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  stats: {
    totalTasks: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    pendingTasks: {
      type: Number,
      default: 0,
    },
    overdueTasks: {
      type: Number,
      default: 0,
    },
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

projectSchema.pre("validate", function setProjectKey() {
  if (!this.key && this.name) {
    this.key = this.name
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 6)
      .toUpperCase();
  }
});

projectSchema.index({ status: 1, dueDate: 1 });
projectSchema.index({ "members.user": 1 });

module.exports = mongoose.model("Project", projectSchema);

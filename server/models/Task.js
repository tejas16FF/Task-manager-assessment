const mongoose = require("mongoose");

const {
  TASK_PRIORITY,
  TASK_STATUS,
} = require("../constants");

const taskCommentSchema =
  new mongoose.Schema(
    {
      author: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: true,
    }
  );

const taskAttachmentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      mimeType: {
        type: String,
        default: "",
        trim: true,
      },

      size: {
        type: Number,
        default: 0,
      },

      uploadedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: true,
    }
  );

const taskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

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

      projectRef: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        index: true,
      },

      priority: {
        type: String,
        enum: Object.values(
          TASK_PRIORITY
        ),
        default:
          TASK_PRIORITY.MEDIUM,
      },

      status: {
        type: String,

        enum: [
          TASK_STATUS.PENDING,
          TASK_STATUS.IN_PROGRESS,
          TASK_STATUS.COMPLETED,
        ],

        default:
          TASK_STATUS.PENDING,

        set: (value) => {
          if (!value) {
            return TASK_STATUS.PENDING;
          }

          const normalized =
            value
              .toString()
              .trim()
              .toLowerCase();

          if (
            normalized ===
            "pending"
          ) {
            return TASK_STATUS.PENDING;
          }

          if (
            normalized ===
            "in_progress"
          ) {
            return TASK_STATUS.IN_PROGRESS;
          }

          if (
            normalized ===
            "completed"
          ) {
            return TASK_STATUS.COMPLETED;
          }

          return TASK_STATUS.PENDING;
        },
      },

      completed: {
        type: Boolean,
        default: false,
      },

      dueDate: {
        type: Date,
      },

      assignedTo: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      reviewer: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      labels: [
        {
          type: String,
          trim: true,
        },
      ],

      comments: [
        taskCommentSchema,
      ],

      attachments: [
        taskAttachmentSchema,
      ],

      position: {
        type: Number,
        default: 0,
      },

      // =====================
      // TASK TIMELINE
      // =====================

      assignedAt: {
        type: Date,
        default: Date.now,
      },

      startedAt: {
        type: Date,
      },

      completedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

taskSchema.pre(
  "validate",
  function () {
    if (this.status) {
      this.status =
        this.status
          .toString()
          .trim()
          .toLowerCase();
    }

    // COMPLETED
    if (
      this.status ===
      TASK_STATUS.COMPLETED
    ) {
      this.completed = true;

      this.completedAt =
        this.completedAt ||
        new Date();
    }

    // IN PROGRESS
    else if (
      this.status ===
      TASK_STATUS.IN_PROGRESS
    ) {
      this.completed = false;

      this.completedAt =
        undefined;

      this.startedAt =
        this.startedAt ||
        new Date();
    }

    // PENDING
    else {
      this.completed = false;

      this.completedAt =
        undefined;
    }
  }
);

taskSchema.index({
  assignedTo: 1,
  status: 1,
  dueDate: 1,
});

taskSchema.index({
  projectRef: 1,
  status: 1,
  position: 1,
});

taskSchema.index({
  project: 1,
  status: 1,
});

module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );
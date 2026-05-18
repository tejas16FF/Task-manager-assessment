const Task = require("../models/Task");

const populateTaskUsers = [
  { path: "assignedTo", select: "name email role" },
  { path: "createdBy", select: "name email role" },
];

function normalizeTaskPayload(body) {
  const remarks = body.remarks ?? body.description ?? "";
  const project = body.project?.trim() || "General";

  return {
    title: body.title,
    project,
    remarks,
    description: remarks,
    priority: body.priority,
    dueDate: body.dueDate || null,
    assignedTo: body.assignedTo || null,
  };
}

async function getTasks(req, res) {
  try {
    const query = req.user.role === "admin"
      ? {}
      : { assignedTo: req.user._id };

    const tasks = await Task.find(query)
      .populate(populateTaskUsers)
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createTask(req, res) {
  try {
    const payload = normalizeTaskPayload(req.body);

    if (!payload.title || payload.title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }

    if (!payload.assignedTo) {
      return res.status(400).json({ message: "Assigned member is required" });
    }

    const task = await Task.create({
      ...payload,
      createdBy: req.user._id,
      completed: Boolean(req.body.completed),
    });

    const populatedTask = await Task.findById(task._id).populate(populateTaskUsers);
    return res.status(201).json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const payload = normalizeTaskPayload(req.body);

    if (!payload.title || payload.title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).populate(populateTaskUsers);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function toggleComplete(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignedMember =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isAssignedMember) {
      return res.status(403).json({ message: "You can only update assigned tasks" });
    }

    task.completed = !task.completed;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate(populateTaskUsers);
    return res.json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
};

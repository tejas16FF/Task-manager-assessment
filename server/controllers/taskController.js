const taskService = require("../services/task.service");
const asyncHandler = require("../utils/asyncHandler");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.user, req.query);
  return res.json(tasks);
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTask(req.params.id, req.user);
  return res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user);
  return res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  return res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id);
  return res.json(result);
});

const toggleComplete = asyncHandler(async (req, res) => {
  const task = await taskService.toggleComplete(req.params.id, req.user);
  return res.json(task);
});

const moveTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.moveTaskStatus(
    req.params.id,
    req.body.status,
    req.user
  );
  return res.json(task);
});

module.exports = {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  moveTaskStatus,
  toggleComplete,
  updateTask,
};

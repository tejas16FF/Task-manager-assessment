const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  moveTaskStatus,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role.middleware");

const canManageTasks = authorizeRoles("admin", "manager");

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", canManageTasks, createTask);
router.put("/:id", canManageTasks, updateTask);
router.delete("/:id", canManageTasks, deleteTask);
router.patch("/:id/toggle-complete", toggleComplete);
router.patch("/:id/status", moveTaskStatus);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", adminMiddleware, createTask);
router.put("/:id", adminMiddleware, updateTask);
router.delete("/:id", adminMiddleware, deleteTask);
router.patch("/:id/toggle-complete", toggleComplete);

module.exports = router;

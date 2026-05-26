const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getEmployeeStats,
  updateUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id/stats", getEmployeeStats);

router.post("/", createUser);

router.put("/:id", updateUser);

module.exports = router;
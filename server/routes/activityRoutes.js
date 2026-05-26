const express = require("express");

const {
  getActivities,
  getProjectActivities,
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getActivities);

router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectActivities
);

module.exports = router;
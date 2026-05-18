const express = require("express");
const router = express.Router();

const { createProject, getProjects } = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", adminMiddleware, createProject);

module.exports = router;

const express = require("express");
const router = express.Router();

const { createUser, getUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;

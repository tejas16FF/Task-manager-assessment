const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    const canAssignRole = req.user?.role === "admin" || isFirstUser;
    const nextRole = canAssignRole && ["admin", "member"].includes(role) ? role : "member";

    const user = await User.create({
      name,
      email,
      password,
      role: isFirstUser ? "admin" : nextRole,
    });

    const token = generateToken(user);

    return res.status(201).json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

module.exports = {
  register,
  login,
  me,
};

const { USER_ROLES } = require("../constants");
const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");
const AppError = require("../utils/AppError");
const { serializeUser } = require("../utils/serializers");
const { normalizeRole } = require("./auth.service");

async function getUsers() {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return users.map(serializeUser);
}

async function createUser(payload) {
  const {
    name,
    email,
    password,
    role = USER_ROLES.EMPLOYEE,
    avatar = "",
    designation = "",
    department = "",
    phone = "",
  } = payload;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const nextRole = normalizeRole(role);

  if (!Object.values(USER_ROLES).includes(nextRole)) {
    throw new AppError("Invalid role", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: nextRole,
    avatar,
    designation,
    department,
    phone,
  });

  return serializeUser(user);
}
async function getEmployeeStats(userId) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const tasks = await Task.find({
    assignedTo: userId,
  });

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const projects = await Project.find({
    "members.user": userId,
  });

  return {
    user: serializeUser(user),
    stats: {
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      totalProjects: projects.length,
      completionRate:
        tasks.length === 0
          ? 0
          : Math.round(
              (completedTasks / tasks.length) * 100
            ),
    },
    projects,
    tasks,
  };
}
async function updateUser(userId, payload) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.name = payload.name || user.name;
  user.email = payload.email || user.email;
  user.role = payload.role || user.role;
  user.department =
    payload.department || user.department;

  user.designation =
    payload.designation || user.designation;

  user.phone = payload.phone || user.phone;

  if (payload.avatar !== undefined) {
    user.avatar = payload.avatar;
  }

  await user.save();

  return serializeUser(user);
}
module.exports = {
  createUser,
  getUsers,
  getEmployeeStats,
  updateUser,
};
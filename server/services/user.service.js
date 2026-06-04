const { USER_ROLES } = require("../constants");
const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");
const AppError = require("../utils/AppError");
const { serializeUser } = require("../utils/serializers");
const { normalizeRole } = require("./auth.service");

function getTaskDurationSeconds(task) {
  if (task.totalTimeTaken && task.totalTimeTaken > 0) {
    return task.totalTimeTaken;
  }

  if (!task.startedAt || !task.completedAt) {
    return 0;
  }

  const duration = Math.floor(
    (new Date(task.completedAt) - new Date(task.startedAt)) / 1000
  );

  return duration > 0 ? duration : 0;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function buildTimedSummary(tasks, baselineSeconds = 0) {
  const timedTasks = tasks.filter(
    (task) => task.completed && getTaskDurationSeconds(task) > 0
  );

  const totalSeconds = timedTasks.reduce(
    (sum, task) => sum + getTaskDurationSeconds(task),
    0
  );

  const averageSeconds =
    timedTasks.length === 0 ? 0 : totalSeconds / timedTasks.length;

  return {
    timedTasks: timedTasks.length,
    averageHours: round(averageSeconds / 3600),
    totalHours: round(totalSeconds / 3600),
    efficiencyScore:
      averageSeconds && baselineSeconds
        ? Math.min(200, Math.round((baselineSeconds / averageSeconds) * 100))
        : 0,
  };
}

function buildCompletionTrend(tasks) {
  const trendMap = {};

  tasks.forEach((task) => {
    const durationSeconds = getTaskDurationSeconds(task);

    if (!task.completed || !task.completedAt || durationSeconds <= 0) {
      return;
    }

    const dateKey = formatDateKey(task.completedAt);

    if (!trendMap[dateKey]) {
      trendMap[dateKey] = {
        date: dateKey,
        completed: 0,
        totalSeconds: 0,
      };
    }

    trendMap[dateKey].completed += 1;
    trendMap[dateKey].totalSeconds += durationSeconds;
  });

  return Object.values(trendMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => ({
      date: point.date,
      completed: point.completed,
      averageHours: round(point.totalSeconds / point.completed / 3600),
    }));
}

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

  const allTimedCompletedTasks = await Task.find({
    status: "completed",
  }).select("startedAt completedAt totalTimeTaken completed");

  const timedCompletedTasks = allTimedCompletedTasks.filter(
    (task) => getTaskDurationSeconds(task) > 0
  );

  const baselineSeconds =
    timedCompletedTasks.length === 0
      ? 0
      : timedCompletedTasks.reduce(
          (sum, task) => sum + getTaskDurationSeconds(task),
          0
        ) / timedCompletedTasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const projects = await Project.find({
    "members.user": userId,
  });

  const projectAnalyticsMap = {};

  tasks.forEach((task) => {
    const projectName = task.project || "General";

    if (!projectAnalyticsMap[projectName]) {
      projectAnalyticsMap[projectName] = {
        name: projectName,
        totalTasks: 0,
        completedTasks: 0,
        tasks: [],
      };
    }

    projectAnalyticsMap[projectName].totalTasks += 1;
    projectAnalyticsMap[projectName].tasks.push(task);

    if (task.completed) {
      projectAnalyticsMap[projectName].completedTasks += 1;
    }
  });

  const projectAnalytics = Object.values(projectAnalyticsMap).map((project) => {
    const timedSummary = buildTimedSummary(project.tasks, baselineSeconds);

    return {
      name: project.name,
      totalTasks: project.totalTasks,
      completedTasks: project.completedTasks,
      completionRate:
        project.totalTasks === 0
          ? 0
          : Math.round((project.completedTasks / project.totalTasks) * 100),
      ...timedSummary,
      trend: buildCompletionTrend(project.tasks),
    };
  });

  const timedSummary = buildTimedSummary(tasks, baselineSeconds);

  return {
    user: serializeUser(user),
    stats: {
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      totalProjects: projects.length,
      ...timedSummary,
      completionRate:
        tasks.length === 0
          ? 0
          : Math.round(
              (completedTasks / tasks.length) * 100
            ),
    },
    projects,
    projectAnalytics,
    completionTrend: buildCompletionTrend(tasks),
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

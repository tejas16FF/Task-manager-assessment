const { USER_ROLES } = require("../constants");
const Project = require("../models/Project");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");
const {
  serializeProject,
  serializeTask,
} = require("../utils/serializers");

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

function getDifficultyWeight(task) {
  const weights = {
    Easy: 0.75,
    Normal: 1,
    Hard: 1.5,
    Expert: 2,
  };

  return weights[task.difficulty] || weights.Normal;
}

function getDifficultyAdjustedSeconds(task) {
  const duration = getTaskDurationSeconds(task);

  return duration > 0 ? duration / getDifficultyWeight(task) : 0;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
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

function buildProjectAnalytics(tasks) {
  const employeeMap = {};
  const timedTasks = tasks.filter(
    (task) => task.completed && getTaskDurationSeconds(task) > 0
  );
  const totalSeconds = timedTasks.reduce(
    (sum, task) => sum + getTaskDurationSeconds(task),
    0
  );
  const adjustedSeconds = timedTasks.reduce(
    (sum, task) => sum + getDifficultyAdjustedSeconds(task),
    0
  );
  const averageSeconds =
    timedTasks.length === 0 ? 0 : totalSeconds / timedTasks.length;
  const adjustedAverageSeconds =
    timedTasks.length === 0 ? 0 : adjustedSeconds / timedTasks.length;

  tasks.forEach((task) => {
    const employeeName = task.assignedTo?.name || "Unassigned";

    if (!employeeMap[employeeName]) {
      employeeMap[employeeName] = {
        name: employeeName,
        total: 0,
        completed: 0,
        timedTasks: 0,
        totalSeconds: 0,
        difficultyAdjustedSeconds: 0,
      };
    }

    employeeMap[employeeName].total += 1;

    if (task.completed) {
      employeeMap[employeeName].completed += 1;
    }

    const durationSeconds = getTaskDurationSeconds(task);

    if (task.completed && durationSeconds > 0) {
      employeeMap[employeeName].timedTasks += 1;
      employeeMap[employeeName].totalSeconds += durationSeconds;
      employeeMap[employeeName].difficultyAdjustedSeconds +=
        getDifficultyAdjustedSeconds(task);
    }
  });

  const employeeStats = Object.values(employeeMap)
    .map((employee) => {
      const employeeAverageSeconds =
        employee.timedTasks === 0
          ? 0
          : employee.totalSeconds / employee.timedTasks;
      const employeeAdjustedSeconds =
        employee.timedTasks === 0
          ? 0
          : employee.difficultyAdjustedSeconds / employee.timedTasks;

      return {
        ...employee,
        averageHours: round(employeeAverageSeconds / 3600),
        difficultyAdjustedHours: round(employeeAdjustedSeconds / 3600),
        efficiencyScore:
          employeeAdjustedSeconds && adjustedAverageSeconds
            ? Math.min(
                200,
                Math.round(
                  (adjustedAverageSeconds / employeeAdjustedSeconds) * 100
                )
              )
            : 0,
      };
    })
    .sort((a, b) => b.completed - a.completed);

  return {
    averageCompletionHours: round(averageSeconds / 3600),
    difficultyAdjustedHours: round(adjustedAverageSeconds / 3600),
    timedCompletedTasks: timedTasks.length,
    statusBreakdown: {
      completed: tasks.filter((task) => task.status === "completed").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      pending: tasks.filter((task) => task.status === "pending").length,
    },
    completionTrend: buildCompletionTrend(tasks),
    employeeStats,
  };
}

async function recalculateProjectStats(projectId, projectName = "") {
  const query = projectId
    ? { $or: [{ projectRef: projectId }, { project: projectName }] }
    : { project: projectName || "General" };

  const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
    Task.countDocuments(query),
    Task.countDocuments({ ...query, completed: true }),
    Task.countDocuments({
      ...query,
      completed: false,
      dueDate: { $lt: new Date() },
    }),
  ]);

  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  if (projectId) {
    await Project.findByIdAndUpdate(projectId, {
      progress,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
    });
  }

  return {
    completedTasks,
    overdueTasks,
    pendingTasks,
    progress,
    totalTasks,
  };
}

async function findOrCreateProjectByName(name, userId) {
  const projectName = name?.trim() || "General";

  return Project.findOneAndUpdate(
    { name: projectName },
    {
      $setOnInsert: {
        name: projectName,
        createdBy: userId,
        owner: userId,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
}

async function getProjects(currentUser) {
  if (!currentUser || ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(currentUser.role)) {
    const tasks = await Task.find({ assignedTo: currentUser._id }).select("project").lean();
    const projectNames = [...new Set(tasks.map((task) => task.project || "General"))]
      .sort((a, b) => a.localeCompare(b));

    return projectNames.map((name) => ({ name }));
  }

  const [projects, tasks] = await Promise.all([
    Project.find().sort({ name: 1 }).lean(),
    Task.find().select("project").lean(),
  ]);

  const projectMap = new Map();

  projects.forEach((project) => {
    projectMap.set(project.name, serializeProject(project));
  });

  tasks.forEach((task) => {
    const name = task.project || "General";
    if (!projectMap.has(name)) {
      projectMap.set(name, { name });
    }
  });

  return Array.from(projectMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function createProject(payload, currentUser) {
  const name = payload.name?.trim();

  if (!name || name.length < 2) {
    throw new AppError("Project name must be at least 2 characters", 400);
  }

  const project = await Project.findOneAndUpdate(
    { name },
    {
      $setOnInsert: {
        name,
        description: payload.description || "",
        createdBy: currentUser._id,
        owner: currentUser._id,
        manager: payload.manager || currentUser._id,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  return serializeProject(project);
}

async function deleteProject(projectId) {
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await Task.deleteMany({
    $or: [
      { projectRef: project._id },
      { project: project.name },
    ],
  });

  return { message: "Project deleted successfully" };
}
function canReadAdminAnalytics(user) {
  return [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(user?.role);
}

async function getProjectDetails(projectId, currentUser) {
  const project = await Project.findById(projectId)
    .populate({
      path: "members.user",
      select: "name email role avatar",
    })
    .lean();

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const tasks = await Task.find({
    projectRef: projectId,
  })
    .populate({
      path: "assignedTo",
      select: "name email role",
    })
    .lean();

  const stats = await recalculateProjectStats(
    projectId,
    project.name
  );

  const includeAdminFields = canReadAdminAnalytics(currentUser);

  return {
    ...(includeAdminFields ? { analytics: buildProjectAnalytics(tasks) } : {}),
    project: serializeProject(project),
    stats,
    tasks: tasks.map((task) =>
      serializeTask(task, {
        includeAdminFields,
      })
    ),
    members: project.members || [],
  };
}
module.exports = {
  createProject,
  deleteProject,
  findOrCreateProjectByName,
  getProjects,
  getProjectDetails,
  recalculateProjectStats,
};

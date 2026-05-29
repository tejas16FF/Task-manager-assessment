const { USER_ROLES } = require("../constants");
const Project = require("../models/Project");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");
const { serializeProject } = require("../utils/serializers");

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
async function getProjectDetails(projectId) {
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

  return {
    project: serializeProject(project),
    stats,
    tasks,
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

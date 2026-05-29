function formatDateInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  const data = typeof user.toObject === "function" ? user.toObject() : user;

  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role === "member" ? "employee" : data.role,
    avatar: data.avatar || "",
    designation: data.designation || "",
    department: data.department || "",
    phone: data.phone || "",
    isActive: data.isActive !== false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function serializeProject(project) {
  if (!project) {
    return null;
  }

  const data = typeof project.toObject === "function" ? project.toObject() : project;

  return {
    _id: data._id,
    name: data.name,
    key: data.key || "",
    description: data.description || "",
    status: data.status || "active",
    priority: data.priority || "Medium",
    owner: data.owner || null,
    manager: data.manager || null,
    members: data.members || [],
    startDate: formatDateInput(data.startDate),
    dueDate: formatDateInput(data.dueDate),
    progress: data.progress || 0,
    stats: data.stats || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
    },
    createdBy: data.createdBy || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function serializeTask(task) {
  if (!task) {
    return null;
  }

  const data = typeof task.toObject === "function" ? task.toObject() : task;

  return {
    _id: data._id,
    title: data.title,
    description: data.description || "",
    remarks: data.remarks || "",
    project: data.project || data.projectRef?.name || "General",
    projectRef: data.projectRef || null,
    priority: data.priority || "Medium",
    status: data.status || (data.completed ? "completed" : "pending"),
    completed: Boolean(data.completed),
    dueDate: formatDateInput(data.dueDate),
    assignedTo: data.assignedTo || null,
    createdBy: data.createdBy || null,
    reviewer: data.reviewer || null,
    labels: data.labels || [],
    comments: data.comments || [],
    attachments: data.attachments || [],
    position: data.position || 0,
    assignedAt: data.assignedAt,
    startedAt: data.startedAt,
    completedAt: data.completedAt,
    totalTimeTaken: data.totalTimeTaken || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

module.exports = {
  formatDateInput,
  serializeProject,
  serializeTask,
  serializeUser,
};

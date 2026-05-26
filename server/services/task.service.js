  const {
    ACTIVITY_ACTIONS,
    NOTIFICATION_TYPES,
    TASK_STATUS,
    USER_ROLES,
  } = require("../constants");
  const Project = require("../models/Project");
  const Task = require("../models/Task");
  const AppError = require("../utils/AppError");
  const { serializeTask } = require("../utils/serializers");
  const { createActivity } = require("./activity.service");
  const { createNotification } = require("./notification.service");
  const { getIO } = require("../sockets/socket");
  const {
    findOrCreateProjectByName,
    recalculateProjectStats,
  } = require("./project.service");

  const populateTaskUsers = [
    { path: "assignedTo", select: "name email role avatar" },
    { path: "createdBy", select: "name email role avatar" },
    { path: "reviewer", select: "name email role avatar" },
    { path: "projectRef", select: "name key status progress" },
  ];

  function normalizeTaskPayload(body) {
    const remarks = body.remarks ?? body.description ?? "";
    const project = body.project?.trim() || "General";

    return {
      title: body.title?.trim(),
      project,
      remarks,
      description: remarks,
      priority: body.priority,
      status: body.status,
      dueDate: body.dueDate || null,
      assignedTo: body.assignedTo || null,
      reviewer: body.reviewer || null,
      labels: Array.isArray(body.labels) ? body.labels : [],
    };
  }

  function assertTaskPayload(payload, requireAssignee = true) {
    if (!payload.title || payload.title.length < 3) {
      throw new AppError("Title must be at least 3 characters", 400);
    }

    if (requireAssignee && !payload.assignedTo) {
      throw new AppError("Assigned member is required", 400);
    }
  }

  function canReadAllTasks(user) {
    return [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(user.role);
  }

  async function populateTask(taskId) {
    return Task.findById(taskId).populate(populateTaskUsers);
  }

  async function getTasks(currentUser, filters = {}) {
    const query = canReadAllTasks(currentUser)
      ? {}
      : { assignedTo: currentUser._id };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.project) {
      query.project = filters.project;
    }

    const tasks = await Task.find(query)
      .populate(populateTaskUsers)
      .sort({ createdAt: -1 });

    return tasks.map(serializeTask);
  }

  async function createTask(payload, currentUser) {
    const normalizedPayload = normalizeTaskPayload(payload);
    assertTaskPayload(normalizedPayload);

    const project = await findOrCreateProjectByName(normalizedPayload.project, currentUser._id);

    const task = new Task({
      ...normalizedPayload,
      projectRef: project._id,
      createdBy: currentUser._id,
      completed: Boolean(payload.completed),
    });

    await task.save();

    await Project.findByIdAndUpdate(project._id, {
      $addToSet: {
        members: {
          user: normalizedPayload.assignedTo,
          role: "member",
        },
      },
    });

  await Promise.all([
    recalculateProjectStats(project._id, project.name),

    createActivity({
      actor: currentUser._id,
      action: ACTIVITY_ACTIONS.TASK_ASSIGNED,
      entityType: "task",
      entityId: task._id,
      project: project._id,
      task: task._id,
      targetUser: normalizedPayload.assignedTo,
      message: `Task "${task.title}" assigned`,
      metadata: {
        projectName: project.name,
      },
    }),

    createNotification({
      recipient: normalizedPayload.assignedTo,
      sender: currentUser._id,
      type: NOTIFICATION_TYPES.TASK_ASSIGNED,
      title: "New task assigned",
      message: `You were assigned "${task.title}"`,
      project: project._id,
      task: task._id,
    }),
  ]);

  const io = getIO();

  io.emit("task-created", {
    message: "New task created",
    taskId: task._id,
    title: task.title,
    projectId: project._id,
  });
  io.to(
    `user-${normalizedPayload.assignedTo}`
  ).emit("notification", {
    type: "TASK_ASSIGNED",
    title: "New task assigned",
    message: `New task assigned: "${task.title}"`,
    taskId: task._id,
  });

    return serializeTask(await populateTask(task._id));
  }

  async function updateTask(taskId, payload, currentUser) {
    const normalizedPayload = normalizeTaskPayload(payload);
    assertTaskPayload(normalizedPayload, false);

    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const previousAssignee = task.assignedTo?.toString();
    const project = await findOrCreateProjectByName(normalizedPayload.project, currentUser._id);

    task.set({
      ...normalizedPayload,
      projectRef: project._id,
    });

    await task.save();

    const assigneeChanged =
      normalizedPayload.assignedTo &&
      previousAssignee !== normalizedPayload.assignedTo.toString();

    const sideEffects = [
      recalculateProjectStats(project._id, project.name),
      createActivity({
        actor: currentUser._id,
        action: assigneeChanged ? ACTIVITY_ACTIONS.TASK_ASSIGNED : ACTIVITY_ACTIONS.TASK_UPDATED,
        entityType: "task",
        entityId: task._id,
        project: project._id,
        task: task._id,
        targetUser: normalizedPayload.assignedTo,
        message: assigneeChanged
          ? `Task "${task.title}" reassigned`
          : `Task "${task.title}" updated`,
      }),
    ];

    if (assigneeChanged) {
      sideEffects.push(createNotification({
        recipient: normalizedPayload.assignedTo,
        sender: currentUser._id,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: "Task assigned",
        message: `You were assigned "${task.title}"`,
        project: project._id,
        task: task._id,
      }));
    }

    await Promise.all(sideEffects);

    return serializeTask(await populateTask(task._id));
  }

  async function deleteTask(taskId) {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.projectRef) {
      await recalculateProjectStats(task.projectRef, task.project);
    }

    return { message: "Task deleted successfully" };
  }

  async function toggleComplete(
  taskId,
  currentUser
) {
  const task =
    await Task.findById(
      taskId
    );

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  const isAssignedEmployee =
    task.assignedTo &&
    task.assignedTo.toString() ===
      currentUser._id.toString();

  /*
    Only admin/manager
    or assigned employee
  */
  if (
    !canReadAllTasks(
      currentUser
    ) &&
    !isAssignedEmployee
  ) {
    throw new AppError(
      "You can only update assigned tasks",
      403
    );
  }

  let activityAction =
    ACTIVITY_ACTIONS.TASK_UPDATED;

  let activityMessage =
    `Task "${task.title}" updated`;

  /*
    =========================
    TASK FLOW

    pending
      ↓
    in_progress
      ↓
    completed
    =========================
  */

  /*
    START TASK
  */
  if (
    task.status ===
    TASK_STATUS.PENDING
  ) {
    task.status =
      TASK_STATUS.IN_PROGRESS;

    task.completed =
      false;

    /*
      Save started time
    */
    task.startedAt =
      new Date();

    activityAction =
      ACTIVITY_ACTIONS.TASK_STARTED;

    activityMessage =
      `Task "${task.title}" started`;
  }

  /*
    COMPLETE TASK
  */
  else if (
    task.status ===
    TASK_STATUS.IN_PROGRESS
  ) {
    task.status =
      TASK_STATUS.COMPLETED;

    task.completed =
      true;

    /*
      Save completed time
    */
    task.completedAt =
      new Date();

    /*
      Calculate total work duration
      in seconds
    */
    if (
      task.startedAt
    ) {
      task.totalTimeTaken =
        Math.floor(
          (
            task.completedAt -
            task.startedAt
          ) / 1000
        );
    }

    activityAction =
      ACTIVITY_ACTIONS.TASK_COMPLETED;

    activityMessage =
      `Task "${task.title}" completed`;
  }

  /*
    REOPEN TASK
  */
  else if (
    task.status ===
    TASK_STATUS.COMPLETED
  ) {
    task.status =
      TASK_STATUS.PENDING;

    task.completed =
      false;

    /*
      Reset tracking
    */
    task.startedAt =
      undefined;

    task.completedAt =
      undefined;

    task.totalTimeTaken =
      0;

    activityMessage =
      `Task "${task.title}" reopened`;
  }

  await task.save();

  const sideEffects =
    [];

  /*
    Recalculate project stats
  */
  if (
    task.projectRef
  ) {
    sideEffects.push(
      recalculateProjectStats(
        task.projectRef,
        task.project
      )
    );
  }

  /*
    Activity log
  */
  sideEffects.push(
    createActivity({
      actor:
        currentUser._id,

      action:
        activityAction,

      entityType:
        "task",

      entityId:
        task._id,

      project:
        task.projectRef,

      task:
        task._id,

      targetUser:
        task.assignedTo,

      message:
        activityMessage,
    })
  );

  await Promise.all(
    sideEffects
  );

  return serializeTask(
    await populateTask(
      task._id
    )
  );
}

  module.exports = {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
    toggleComplete,
  };

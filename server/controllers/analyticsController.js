const Task = require("../models/Task");

const getAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const tasks =
      await Task.find()
        .populate(
          "assignedTo",
          "name"
        );

    const totalTasks =
      tasks.length;

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "completed"
      ).length;

    const pendingTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "pending"
      ).length;

    const inProgressTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "in_progress"
      ).length;

    // Employee productivity
    const employeeMap = {};

    tasks.forEach((task) => {
      if (
        !task.assignedTo
      ) {
        return;
      }

      const name =
        task.assignedTo
          .name;

      if (
        !employeeMap[
          name
        ]
      ) {
        employeeMap[
          name
        ] = 0;
      }

      if (
        task.status ===
        "completed"
      ) {
        employeeMap[
          name
        ] += 1;
      }
    });

    const employeeStats =
      Object.entries(
        employeeMap
      ).map(
        ([name, completed]) => ({
          name,
          completed,
        })
      );

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      employeeStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};

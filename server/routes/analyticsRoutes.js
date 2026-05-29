const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const Task =
  require("../models/Task");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    if (
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Analytics is available for admins only",
      });
    }

    const tasks =
      await Task.find({})
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

    const employeeMap = {};
    const projectMap = {};

    tasks.forEach((task) => {
      const employee =
        task.assignedTo?.name ||
        "Unassigned";

      if (
        !employeeMap[
          employee
        ]
      ) {
        employeeMap[
          employee
        ] = {
          name: employee,
          completed: 0,
        };
      }

      if (
        task.status ===
        "completed"
      ) {
        employeeMap[
          employee
        ].completed += 1;
      }

      const project =
        task.project ||
        "General";

      if (!projectMap[project]) {
        projectMap[project] = {
          name: project,
          total: 0,
          completed: 0,
        };
      }

      projectMap[project].total += 1;

      if (task.status === "completed") {
        projectMap[project].completed += 1;
      }
    });

    const employeeStats =
      Object.values(
        employeeMap
      );

    const projectStats =
      Object.values(
        projectMap
      );

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      employeeStats,
      projectStats,
    });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({
        message:
          "Analytics error",
      });
  }
});

module.exports = router;    

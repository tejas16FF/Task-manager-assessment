const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const Task =
  require("../models/Task");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    let filter = {};

    // EMPLOYEE / MEMBER
    if (
      req.user.role !== "admin"
    ) {
      filter.assignedTo =
        req.user._id;
    }

    const tasks =
      await Task.find(filter)
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
    });

    const employeeStats =
      Object.values(
        employeeMap
      );

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      employeeStats,
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
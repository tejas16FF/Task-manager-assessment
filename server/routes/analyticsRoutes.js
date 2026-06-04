const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const Task =
  require("../models/Task");

router.use(authMiddleware);

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

function buildEfficiencyScore(averageSeconds, baselineSeconds) {
  if (!averageSeconds || !baselineSeconds) {
    return 0;
  }

  return Math.min(200, Math.round((baselineSeconds / averageSeconds) * 100));
}

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

    const completedWithTime = tasks.filter(
      (task) => task.status === "completed" && getTaskDurationSeconds(task) > 0
    );

    const actualBaselineSeconds =
      completedWithTime.length === 0
        ? 0
        : completedWithTime.reduce(
            (sum, task) => sum + getTaskDurationSeconds(task),
            0
          ) / completedWithTime.length;

    const baselineSeconds =
      completedWithTime.length === 0
        ? 0
        : completedWithTime.reduce(
            (sum, task) => sum + getDifficultyAdjustedSeconds(task),
            0
          ) / completedWithTime.length;

    const employeeMap = {};
    const projectMap = {};
    const trendMap = {};

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
          id: task.assignedTo?._id || null,
          name: employee,
          total: 0,
          completed: 0,
          timedTasks: 0,
          totalSeconds: 0,
          difficultyAdjustedSeconds: 0,
        };
      }

      employeeMap[employee].total += 1;

      if (
        task.status ===
        "completed"
      ) {
        employeeMap[
          employee
        ].completed += 1;

        const durationSeconds = getTaskDurationSeconds(task);

        if (durationSeconds > 0) {
          employeeMap[employee].timedTasks += 1;
          employeeMap[employee].totalSeconds += durationSeconds;
          employeeMap[employee].difficultyAdjustedSeconds +=
            getDifficultyAdjustedSeconds(task);
        }
      }

      const project =
        task.project ||
        "General";

      if (!projectMap[project]) {
        projectMap[project] = {
          name: project,
          total: 0,
          completed: 0,
          timedTasks: 0,
          totalSeconds: 0,
          difficultyAdjustedSeconds: 0,
        };
      }

      projectMap[project].total += 1;

      if (task.status === "completed") {
        projectMap[project].completed += 1;

        const durationSeconds = getTaskDurationSeconds(task);

        if (durationSeconds > 0) {
          projectMap[project].timedTasks += 1;
          projectMap[project].totalSeconds += durationSeconds;
          projectMap[project].difficultyAdjustedSeconds +=
            getDifficultyAdjustedSeconds(task);
        }
      }

      if (task.status === "completed" && task.completedAt) {
        const durationSeconds = getTaskDurationSeconds(task);

        if (durationSeconds > 0) {
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
        }
      }
    });

    const employeeStats =
      Object.values(
        employeeMap
      )
        .map((employee) => {
          const averageSeconds =
            employee.timedTasks === 0
              ? 0
              : employee.totalSeconds / employee.timedTasks;
          const adjustedAverageSeconds =
            employee.timedTasks === 0
              ? 0
              : employee.difficultyAdjustedSeconds / employee.timedTasks;

          return {
            ...employee,
            averageHours: round(averageSeconds / 3600),
            difficultyAdjustedHours: round(adjustedAverageSeconds / 3600),
            efficiencyScore: buildEfficiencyScore(
              adjustedAverageSeconds,
              baselineSeconds
            ),
          };
        })
        .sort((a, b) => b.efficiencyScore - a.efficiencyScore);

    const projectStats =
      Object.values(
        projectMap
      )
        .map((project) => {
          const averageSeconds =
            project.timedTasks === 0
              ? 0
              : project.totalSeconds / project.timedTasks;
          const adjustedAverageSeconds =
            project.timedTasks === 0
              ? 0
              : project.difficultyAdjustedSeconds / project.timedTasks;

          return {
            ...project,
            averageHours: round(averageSeconds / 3600),
            difficultyAdjustedHours: round(adjustedAverageSeconds / 3600),
            efficiencyScore: buildEfficiencyScore(
              adjustedAverageSeconds,
              baselineSeconds
            ),
          };
        })
        .sort((a, b) => b.completed - a.completed);

    const completionTrend = Object.values(trendMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((point) => ({
        date: point.date,
        completed: point.completed,
        averageHours: round(point.totalSeconds / point.completed / 3600),
      }));

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      timedCompletedTasks: completedWithTime.length,
      averageCompletionHours: round(actualBaselineSeconds / 3600),
      difficultyAdjustedHours: round(baselineSeconds / 3600),
      employeeStats,
      projectStats,
      completionTrend,
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

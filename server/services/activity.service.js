const Activity =
  require("../models/Activity");

const Task =
  require("../models/Task");

/*
  CREATE ACTIVITY
*/
const createActivity =
  async ({
    actor,
    action,
    entityType,
    entityId,
    project,
    task,
    targetUser,
    message,
    metadata = {},
  }) => {
    return await Activity.create({
      actor,
      action,
      entityType,
      entityId,
      project,
      task,
      targetUser,
      message,
      metadata,
    });
  };

/*
  GET ACTIVITIES
*/
const getActivities = async ({
  page = 1,
  limit = 20,
  user,
}) => {
  const skip =
    (page - 1) * limit;

  let query = {};

  /*
    ADMIN
    → see everything
  */
  if (
    user &&
    user.role !== "admin"
  ) {
    /*
      Get tasks assigned
      to logged-in member
    */
    const assignedTasks =
      await Task.find({
        assignedTo:
          user._id,
      }).select("_id");

    const taskIds =
      assignedTasks.map(
        (task) => task._id
      );

    /*
      Only show activities
      related to assigned tasks
    */
    query.task = {
      $in: taskIds,
    };
  }

  const activities =
    await Activity.find(query)
      .populate(
        "actor",
        "name role"
      )
      .populate(
        "task",
        "title"
      )
      .populate(
        "project",
        "name"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

  return activities;
};

/*
  PROJECT ACTIVITIES
*/
const getProjectActivities =
  async (projectId) => {
    return await Activity.find({
      project: projectId,
    })
      .populate(
        "actor",
        "name role"
      )
      .populate(
        "task",
        "title"
      )
      .sort({
        createdAt: -1,
      });
  };

module.exports = {
  createActivity,
  getActivities,
  getProjectActivities,
};
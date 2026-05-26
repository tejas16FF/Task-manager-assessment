const activityService =
  require("../services/activity.service");

const getActivities = async (
  req,
  res,
  next
) => {
  try {
    const page =
      Number(req.query.page) ||
      1;

    const limit =
      Number(req.query.limit) ||
      20;

    const activities =
      await activityService.getActivities(
        {
          page,
          limit,
          user: req.user,
        }
      );

    res
      .status(200)
      .json(activities);
  } catch (error) {
    next(error);
  }
};

const getProjectActivities =
  async (
    req,
    res,
    next
  ) => {
    try {
      const activities =
        await activityService.getProjectActivities(
          req.params.projectId
        );

      res
        .status(200)
        .json(activities);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getActivities,
  getProjectActivities,
};
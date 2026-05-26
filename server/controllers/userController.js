const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();
  return res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(201).json(user);
});
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(
    req.params.id,
    req.body
  );

  return res.json(user);
});
const getEmployeeStats = asyncHandler(async (req, res) => {
  const stats = await userService.getEmployeeStats(
    req.params.id
  );

  return res.json(stats);
});

module.exports = {
  createUser,
  getUsers,
  getEmployeeStats,
  updateUser,
};
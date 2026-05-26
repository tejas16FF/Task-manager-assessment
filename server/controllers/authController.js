const { loginUser, registerUser } = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { serializeUser } = require("../utils/serializers");

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, req.user);
  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res.json(result);
});

const me = asyncHandler(async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

module.exports = {
  login,
  me,
  register,
};

const { USER_ROLES } = require("../constants");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");
const { serializeUser } = require("../utils/serializers");

function normalizeRole(role) {
  if (role === "member") {
    return USER_ROLES.EMPLOYEE;
  }

  return Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.EMPLOYEE;
}

async function registerUser(payload, currentUser = null) {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;
  const canAssignRole = currentUser?.role === USER_ROLES.ADMIN || isFirstUser;
  const nextRole = canAssignRole ? normalizeRole(role) : USER_ROLES.EMPLOYEE;

  const user = await User.create({
    name,
    email,
    password,
    role: isFirstUser ? USER_ROLES.ADMIN : nextRole,
  });

  return {
    user: serializeUser(user),
    token: generateToken(user),
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: serializeUser(user),
    token: generateToken(user),
  };
}

module.exports = {
  loginUser,
  normalizeRole,
  registerUser,
};

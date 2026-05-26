function authorizeRoles(...args) {
  const options = typeof args[args.length - 1] === "object"
    ? args.pop()
    : {};
  const allowedRoles = args;

  return function roleMiddleware(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: options.message || "You do not have permission to perform this action",
      });
    }

    return next();
  };
}

module.exports = authorizeRoles;

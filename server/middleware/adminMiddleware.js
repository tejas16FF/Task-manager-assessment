const authorizeRoles = require("./role.middleware");

const adminOnly = authorizeRoles("admin", { message: "Admin access required" });

function adminMiddleware(req, res, next) {
  return adminOnly(req, res, next);
}

module.exports = adminMiddleware;

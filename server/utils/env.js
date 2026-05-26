const { requireEnv } = require("../config/env");

function getJwtSecret() {
  return requireEnv("JWT_SECRET");
}

module.exports = {
  getJwtSecret,
};

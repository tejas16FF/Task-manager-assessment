const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("./env");

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}

module.exports = generateToken;

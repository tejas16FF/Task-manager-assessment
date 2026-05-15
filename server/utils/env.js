function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing on the server");
  }

  return process.env.JWT_SECRET;
}

module.exports = {
  getJwtSecret,
};

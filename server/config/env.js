require("dotenv").config();

function getEnv(name, fallback = undefined) {
  return process.env[name] || fallback;
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing on the server`);
  }

  return value;
}

function getPort() {
  return Number(getEnv("PORT", 5000));
}

module.exports = {
  getEnv,
  getPort,
  requireEnv,
};

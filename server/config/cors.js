const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://task-manager-assessment-ten.vercel.app",
];

function parseAllowedOrigins() {
  if (!process.env.CLIENT_ORIGINS) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return process.env.CLIENT_ORIGINS
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function createCorsOptions() {
  const allowedOrigins = parseAllowedOrigins();

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  };
}

module.exports = {
  createCorsOptions,
  parseAllowedOrigins,
};

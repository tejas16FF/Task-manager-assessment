const express = require("express");
const cors = require("cors");
const { createCorsOptions } = require("./config/cors");
const connectDatabase = require("./config/db");
const { getPort } = require("./config/env");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error.middleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();
const PORT = getPort();

app.use(cors(createCorsOptions()));
app.use(express.json());

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Set it in server/.env before using auth in production.");
}
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

app.use("/api/analytics", analyticsRoutes);

app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    jwtConfigured: Boolean(process.env.JWT_SECRET),
    mongoConfigured: Boolean(process.env.MONGO_URI),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const http = require("http");
const {
  initializeSocket,
} = require("./sockets/socket");

const server = http.createServer(app);

initializeSocket(server);

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server", error);
    process.exit(1);
  });

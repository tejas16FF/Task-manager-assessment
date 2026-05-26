const mongoose = require("mongoose");

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing on the server");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
}

module.exports = connectDatabase;

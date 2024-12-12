import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";

async function main() {
  // Set up Mongoose event listeners
  mongoose.connection.on("connected", () => {
    console.log("Database connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Database connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
  });

  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("Database connection failed:", err);
  }
}

main();

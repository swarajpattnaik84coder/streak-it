import mongoose from "mongoose";

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Logs a clear error if connection fails but does NOT exit the process,
 * so the /health endpoint remains reachable during local development.
 * In production, ensure MONGO_URI is always set correctly.
 */
export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set — database connection skipped.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error: " + error.message);
    // Do not exit here so /health remains reachable;
    // API routes requiring the DB will fail naturally.
  }
};
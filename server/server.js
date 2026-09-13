import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS — allow the React dev server (and production origin) with credentials
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: origin '" + origin + "' is not allowed"));
      }
    },
    credentials: true,
  })
);

// Body / cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check — always responds regardless of DB state
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "streak it! server is running",
    timestamp: new Date().toISOString(),
  });
});

// Future routes will be mounted here in later phases:
// app.use("/api/auth",  authRoutes);
// app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Start the HTTP server first so /health is always reachable,
// then attempt the database connection.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
  // Attempt DB connection after server is up
  connectDB();
});
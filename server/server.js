import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS — allow frontend origins (Vercel, local dev, custom domain)
const clientOrigin = process.env.CLIENT_ORIGIN;
const allowedOrigins = [
  clientOrigin,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, health checks)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body / cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "streak it! server is running",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/vault", vaultRoutes);

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

// Start HTTP server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
  // Attempt DB connection after server is up
  connectDB();
});
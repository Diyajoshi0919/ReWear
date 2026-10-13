import "./config/env.js"; // must be the first import
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";
import clipRoutes from "./routes/clipRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Render and similar hosts sit behind a proxy; needed for correct client IPs in rate limiting.
app.set("trust proxy", 1);

// CORS: allowed frontend origins come from CLIENT_URL (comma-separated).
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Limit login/signup attempts to slow down password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

// Health check (Render uses this to see if the service is up).
app.get("/", (req, res) => res.json({ status: "ok", service: "ReWear API" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/clip", clipRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});

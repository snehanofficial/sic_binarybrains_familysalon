import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { prisma } from "./lib/prisma";

import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import queueRoutes from "./routes/queueRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = `error: ${err.message || "Database unreachable"}`;
  }

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    platform: "BinaryBrains Family Salon API",
    database: dbStatus,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred on the server.",
    },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 BinaryBrains Express Server listening on http://localhost:${PORT}`);
  });
}

export default app;

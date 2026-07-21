import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify Prisma DB Connection
    await prisma.$connect();
    console.log("✅ Database connection established via Prisma.");
  } catch (error: any) {
    console.warn("⚠️ Warning: Could not connect to Database via Prisma on startup.");
    console.warn(`Details: ${error.message || error}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 BinaryBrains Express Server listening on http://localhost:${PORT}`);
    console.log(`   API Endpoint Base: http://localhost:${PORT}/api`);
    console.log(`   Health Check:      http://localhost:${PORT}/health`);
  });

  // Graceful Shutdown Handlers
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Closing HTTP server and disconnecting Prisma...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("👋 Express server and Prisma client closed successfully.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

startServer();

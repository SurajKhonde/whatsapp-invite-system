import app from "./app";
import { connectDB, closeDB } from "@config/db";
import { logger } from "@core/logger/logger";
import { closeRedis } from "@config/redis";
import { Server } from "http";

const PORT = process.env.PORT || 3000;

let server: Server;

const start = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
};

start();

const shutdown = async (signal: string) => {
  logger.warn(`Received ${signal}. Shutting down...`);

  try {
    if (server) {
      server.close(async () => {
        logger.info("HTTP server closed");

        await closeDB();
        await closeRedis();

        logger.info("Shutdown complete");
        process.exit(0);
      });
    }

    setTimeout(() => {
      logger.error("Force shutdown");
      process.exit(1);
    }, 10000);
  } catch (err) {
    logger.error({ err }, "Shutdown error");
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled Rejection");
  shutdown("unhandledRejection");
});
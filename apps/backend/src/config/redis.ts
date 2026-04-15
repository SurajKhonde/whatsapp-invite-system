import IORedis from "ioredis";
import { logger } from "../core/logger/logger";

const REDIS_URL = process.env.REDIS_URL;

// 🔥 Queue connection (BullMQ)
export const redisQueue = new IORedis(REDIS_URL!, {
  maxRetriesPerRequest: null, // ✅ REQUIRED for BullMQ
  enableReadyCheck: false,
});

// 🔥 Cache connection (normal usage)
export const redisCache = new IORedis(REDIS_URL!, {
  maxRetriesPerRequest: 3,
});


// ✅ Connect check
export const connectRedis = async () => {
  try {
    await redisCache.ping();
    logger.info("Redis connected");
  } catch (err) {
    logger.error({ err }, "Redis connection failed");
    process.exit(1);
  }
};


// ✅ Graceful shutdown
export const closeRedis = async () => {
  try {
    logger.info("Closing Redis connections...");
    await redisQueue.quit();
    await redisCache.quit();
    logger.info("Redis closed");
  } catch (err) {
    logger.error({ err }, "Error closing Redis");
  }
};
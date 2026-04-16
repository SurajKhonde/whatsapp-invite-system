import { Pool } from "pg";
import { logger } from "@core/logger/logger";

const isProd = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("PostgreSQL connected");
  } catch (error) {
    logger.error({ err: error }, "DB connection failed");
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    logger.info("Closing DB pool...");
    await pool.end();
    logger.info("DB pool closed");
  } catch (err) {
    logger.error({ err }, "Error closing DB");
  }
};
import fs from "fs";
import path from "path";
import { pool } from "@config/db";
import { logger } from "@core/logger/logger";

const runMigrations = async () => {
  const dir = __dirname;

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  logger.info(`Migration files found: ${JSON.stringify(files)}`);

  // ✅ check DB
  const dbCheck = await pool.query("SELECT current_database()");
  logger.info(`Connected DB: ${dbCheck.rows[0].current_database}`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      await pool.query(sql);
      logger.info(`Migration applied: ${file}`);
    } catch (err) {
      logger.error({ err }, `Migration failed: ${file}`);
      process.exit(1);
    }
  }

  await pool.end();
};

runMigrations().then(() => process.exit());
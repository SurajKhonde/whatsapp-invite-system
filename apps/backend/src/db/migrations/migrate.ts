import fs from "fs";
import path from "path";
import { pool } from "@config/db";
import { logger } from "@core/logger/logger";

const runMigrations = async () => {
  const dir = __dirname; // ✅ FIXED

  const files = fs.readdirSync(dir).sort();

  for (const file of files) {
    if (file === "migrate.ts") continue; // skip self

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
};

runMigrations().then(() => process.exit());
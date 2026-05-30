import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { logger } from "@core/logger/logger";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

async function main() {
  logger.info("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  logger.info("Migrations complete ✅");
  await client.end();
}

main().catch((err) => {
  logger.error({ err }, "Migration failed ❌");
  process.exit(1);
});
import "dotenv/config";
import type { Config } from "drizzle-kit";
console.log("DRIZZLE DB:", process.env.DATABASE_URL);
export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
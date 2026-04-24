import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),
  category: text("category").notNull(), // birthday, wedding, business

  description: text("description"),

  templateJson: jsonb("template_json").notNull(),

  imageUrl: text("image_url"),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  templateId: uuid("template_id").notNull(),

  eventType: text("event_type").notNull(), // birthday, wedding

  title: text("title"), // optional custom name

  status: text("status").default("draft"), 
  // draft | processing | completed

  totalGuests: integer("total_guests").default(0),
  sentCount: integer("sent_count").default(0),
  failedCount: integer("failed_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
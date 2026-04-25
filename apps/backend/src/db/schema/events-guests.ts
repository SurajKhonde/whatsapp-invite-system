import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { events } from "./events.schema";
import { guests } from "./guest.schema";

export const eventGuests = pgTable("event_guests", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  guestId: uuid("guest_id")
    .notNull()
    .references(() => guests.id, { onDelete: "cascade" }),

  // 🔥 DELIVERY STATUS
  status: text("status").default("pending"),
  // pending | sent | failed

  attempts: integer("attempts").default(0),

  lastAttemptAt: timestamp("last_attempt_at"),

  deliveredAt: timestamp("delivered_at"),

  errorMessage: text("error_message"),

  createdAt: timestamp("created_at").defaultNow(),
});
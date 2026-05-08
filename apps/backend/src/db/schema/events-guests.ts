import { pgTable, uuid, varchar, timestamp, index, foreignKey, text, integer } from "drizzle-orm/pg-core";
import { events } from "./events.schema";
import { guests } from "./guest.schema";

export const eventGuests = pgTable(
  "event_guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").notNull(),
    guestId: uuid("guest_id").notNull(),
    
    // Message status
    status: varchar("status", { length: 50 }).default("pending"),
    whatsappStatus: varchar("whatsapp_status", { length: 50 }).default("pending"),
    messageId: varchar("message_id", { length: 255 }),
    whatsappMessageId: varchar("whatsapp_message_id", { length: 255 }),
    
    // Timestamps
    sentAt: timestamp("sent_at"),
    deliveredAt: timestamp("delivered_at"),
    readAt: timestamp("read_at"),
    failedAt: timestamp("failed_at"),
    
    // Attempts tracking
    attempts: integer("attempts").default(0),
    lastAttemptAt: timestamp("last_attempt_at"),
    
    // Error tracking
    errorMessage: text("error_message"),
    errorCode: varchar("error_code", { length: 100 }),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    eventIdFk: foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "event_guests_event_id_fk",
    }).onDelete("cascade"),
    guestIdFk: foreignKey({
      columns: [table.guestId],
      foreignColumns: [guests.id],
      name: "event_guests_guest_id_fk",
    }).onDelete("cascade"),
    eventIdIdx: index("idx_event_guests_event_id").on(table.eventId),
    guestIdIdx: index("idx_event_guests_guest_id").on(table.guestId),
    statusIdx: index("idx_event_guests_status").on(table.status),
    whatsappStatusIdx: index("idx_event_guests_whatsapp_status").on(table.whatsappStatus),
    sentAtIdx: index("idx_event_guests_sent_at").on(table.sentAt),
    createdAtIdx: index("idx_event_guests_created_at").on(table.createdAt),
  })
);

export type EventGuest = typeof eventGuests.$inferSelect;
export type InsertEventGuest = typeof eventGuests.$inferInsert;
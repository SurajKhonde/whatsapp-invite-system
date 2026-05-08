import { pgTable, uuid, varchar, text, integer, decimal, timestamp, index, foreignKey, jsonb, date, time } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { templates } from "./template.schema";

// ✅ Type for message type
export type MessageType = "text_only" | "image_only" | "image_and_text";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    
    // Event Details
    eventName: varchar("event_name", { length: 255 }),
    eventType: varchar("event_type", { length: 100 }),
    description: text("description"),
    
    // Wedding specific
    groomName: varchar("groom_name", { length: 255 }),
    brideName: varchar("bride_name", { length: 255 }),
    
    // Date & Time
    eventDate: date("event_date"),
    eventTime: time("event_time"),
    
    // Location
    venueName: varchar("venue_name", { length: 255 }),
    venueAddress: text("venue_address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    
    // Guests
    totalGuests: integer("total_guests").default(0),
    
    // Message Stats
    sentCount: integer("sent_count").default(0),
    deliveredCount: integer("delivered_count").default(0),
    readCount: integer("read_count").default(0),
    failedCount: integer("failed_count").default(0),
    pendingCount: integer("pending_count").default(0),
    
    // Template & Message
    templateId: uuid("template_id"),
    templateName: varchar("template_name", { length: 255 }),
    
    // ✅ REQUIRED: Message Type with enum values (NOT nullable)
    messageType: varchar("message_type", { length: 50, enum: ["text_only", "image_only", "image_and_text"] }).notNull().default("text_only"),
    
    // ✅ REQUIRED: WhatsApp Template ID (NOT nullable)
    whatsappTemplateId: varchar("whatsapp_template_id", { length: 255 }).notNull(),
    
    // Template Parameters
    templateParams: jsonb("template_params"),
    
    // Image
    imageUrl: varchar("image_url", { length: 500 }),
    imageGenerationJobId: varchar("image_generation_job_id", { length: 100 }),
    imageApprovedAt: timestamp("image_approved_at"),
    
    // Status
    status: varchar("status", { length: 50 }).default("draft"),
    
    // Payment
    paymentId: varchar("payment_id", { length: 255 }),
    razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
    paymentStatus: varchar("payment_status", { length: 50 }),
    
    // Metadata
    metadata: jsonb("metadata"),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "events_user_id_fk",
    }).onDelete("cascade"),
    templateIdFk: foreignKey({
      columns: [table.templateId],
      foreignColumns: [templates.id],
      name: "events_template_id_fk",
    }).onDelete("set null"),
    userIdIdx: index("idx_events_user_id").on(table.userId),
    statusIdx: index("idx_events_status").on(table.status),
    eventDateIdx: index("idx_events_event_date").on(table.eventDate),
    templateIdIdx: index("idx_events_template_id").on(table.templateId),
    paymentStatusIdx: index("idx_events_payment_status").on(table.paymentStatus),
    createdAtIdx: index("idx_events_created_at").on(table.createdAt),
    updatedAtIdx: index("idx_events_updated_at").on(table.updatedAt),
  })
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
import { pgTable, uuid, varchar, decimal, timestamp, index, foreignKey, jsonb, integer, text } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { events } from "./events.schema";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    eventId: uuid("event_id"),
    
    // Order Details
    orderId: varchar("order_id", { length: 255 }).notNull().unique(),
    razorpayOrderId: varchar("razorpay_order_id", { length: 255 }).notNull().unique(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("INR"),
    
    // Payment Details
    paymentId: varchar("payment_id", { length: 255 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    signature: varchar("signature", { length: 512 }),
    razorpaySignature: varchar("razorpay_signature", { length: 512 }),
    
    // Message Details
    messageType: varchar("message_type", { length: 50 }),
    guestCount: integer("guest_count"),
    
    // Cost Breakdown
    baseCostPaise: decimal("base_cost_paise", { precision: 15, scale: 0 }),
    pricePerMessagePaise: decimal("price_per_message_paise", { precision: 15, scale: 0 }),
    totalAmountPaise: decimal("total_amount_paise", { precision: 15, scale: 0 }),
    baseCost: decimal("base_cost", { precision: 10, scale: 2 }),
    perGuestCost: decimal("per_guest_cost", { precision: 10, scale: 2 }),
    totalGuests: varchar("total_guests", { length: 10 }),
    platformFee: decimal("platform_fee", { precision: 10, scale: 2 }),
    profitPercent: decimal("profit_percent", { precision: 5, scale: 2 }),
    
    // Status
    status: varchar("status", { length: 50 }).default("created"),
    errorCode: varchar("error_code", { length: 100 }),
    errorDescription: text("error_description"),
    
    // Metadata
    metadata: jsonb("metadata"),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "payments_user_id_fk",
    }).onDelete("cascade"),
    eventIdFk: foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "payments_event_id_fk",
    }).onDelete("set null"),
    userIdIdx: index("idx_payments_user_id").on(table.userId),
    eventIdIdx: index("idx_payments_event_id").on(table.eventId),
    statusIdx: index("idx_payments_status").on(table.status),
    razorpayOrderIdIdx: index("idx_payments_razorpay_order_id").on(table.razorpayOrderId),
    razorpayPaymentIdIdx: index("idx_payments_razorpay_payment_id").on(table.razorpayPaymentId),
    createdAtIdx: index("idx_payments_created_at").on(table.createdAt),
  })
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
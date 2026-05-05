import { pgTable, uuid, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { pricingConfig } from "./pricing.schema";

export const payments = pgTable("payments", {
  id:                   uuid("id").defaultRandom().primaryKey(),

  userId:               uuid("user_id")
                          .notNull()
                          .references(() => users.id, { onDelete: "cascade" }),

  // Razorpay IDs
  orderId:              text("order_id").notNull().unique(),
  paymentId:            text("payment_id"),
  signature:            text("signature"),

  // What they bought
  messageType:          text("message_type").notNull(),
  // 'whatsapp_text' | 'whatsapp_image'

  guestCount:           integer("guest_count").notNull(),
  // how many people they want to send to

  // Pricing snapshot at time of purchase
  // (in case you change pricing later, history stays correct)
  baseCostPaise:        numeric("base_cost_paise", { precision: 10, scale: 2 }).notNull(),
  profitPercent:        numeric("profit_percent", { precision: 5, scale: 2 }).notNull(),
  pricePerMessagePaise: numeric("price_per_message_paise", { precision: 10, scale: 2 }).notNull(),

  // Total = pricePerMessage * guestCount
  totalAmountPaise:     integer("total_amount_paise").notNull(),
  currency:             text("currency").default("INR"),

  // Status
  status:               text("status").default("created"),
  // created → paid → failed

  errorCode:            text("error_code"),
  errorDescription:     text("error_description"),

  createdAt:            timestamp("created_at").defaultNow(),
  updatedAt:            timestamp("updated_at").defaultNow(),
});
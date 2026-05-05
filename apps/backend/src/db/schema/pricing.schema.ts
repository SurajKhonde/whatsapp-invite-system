import { pgTable, uuid, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";

// Admin sets base costs here — single source of truth
export const pricingConfig = pgTable("pricing_config", {
  id:                   uuid("id").defaultRandom().primaryKey(),

  // What type of message
  messageType:          text("message_type").notNull().unique(),
  // 'whatsapp_text' | 'whatsapp_image' | 'whatsapp_video'

  // Your actual cost per message (from WhatsApp/Meta billing)
  baseCostPaise:        numeric("base_cost_paise", { precision: 10, scale: 2 }).notNull(),
  // e.g. ₹0.30 = 30 paise for text
  // e.g. ₹0.58 = 58 paise for image (text + image surcharge)

  // Your profit margin (percentage)
  profitPercent:        numeric("profit_percent", { precision: 5, scale: 2 }).notNull().default("30"),
  // 30 means 30% profit on top of base cost

  // Final price shown to user (auto calculated: baseCost + 30%)
  // baseCostPaise * (1 + profitPercent/100)
  // ₹0.30 + 30% = ₹0.39 per message

  isActive:             boolean("is_active").default(true),

  note:                 text("note"), // e.g. "Meta increased image price Nov 2025"

  createdAt:            timestamp("created_at").defaultNow(),
  updatedAt:            timestamp("updated_at").defaultNow(),
});
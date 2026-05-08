import { pgTable, uuid, varchar, decimal, timestamp, index, boolean } from "drizzle-orm/pg-core";

export const pricingConfig = pgTable(
  "pricing_config",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    
    // Message Type
    messageType: varchar("message_type", { length: 50 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    description: varchar("description", { length: 500 }),
    
    // Cost in Paise (1 Rupee = 100 Paise)
    baseCostPaise: decimal("base_cost_paise", { precision: 15, scale: 0 }).notNull(),
    profitPercent: decimal("profit_percent", { precision: 5, scale: 2 }).notNull(),
    
    // Legacy cost fields (for backward compatibility)
    baseCost: decimal("base_cost", { precision: 10, scale: 2 }),
    perGuestCost: decimal("per_guest_cost", { precision: 10, scale: 2 }),
    platformFeePercentage: decimal("platform_fee_percentage", { precision: 5, scale: 2 }),
    
    // Features
    includesImageGeneration: boolean("includes_image_generation").default(false),
    includesPrioritySupport: boolean("includes_priority_support").default(false),
    includesAnalytics: boolean("includes_analytics").default(false),
    
    // Status
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    messageTypeIdx: index("idx_pricing_config_message_type").on(table.messageType),
    isActiveIdx: index("idx_pricing_config_is_active").on(table.isActive),
    createdAtIdx: index("idx_pricing_config_created_at").on(table.createdAt),
  })
);

export type PricingConfig = typeof pricingConfig.$inferSelect;
export type InsertPricingConfig = typeof pricingConfig.$inferInsert;
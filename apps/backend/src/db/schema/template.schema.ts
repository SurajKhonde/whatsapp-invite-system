import { pgTable, uuid, varchar, text, boolean, timestamp, index, jsonb } from "drizzle-orm/pg-core";

/**
 * UNIVERSAL TEMPLATES TABLE
 * ==========================================
 * Single table supporting:
 * - Showcase (text, images, preview)
 * - WhatsApp integration
 * - Admin management
 * - Analytics
 * 
 * All frontends use this ONE table
 */
export const templates = pgTable(
  "templates",
  {
    // ========== PRIMARY KEY ==========
    id: uuid("id").primaryKey().defaultRandom(),

    // ========== BASIC INFO ==========
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    language: varchar("language", { length: 10 }).default("en"),

    // ========== IMAGE HANDLING ==========
    imageUrl: varchar("image_url", { length: 500 }), // Existing field - keep for backward compatibility
    previewImageUrl: varchar("preview_image_url", { length: 500 }), // Cloudinary preview
    hasImage: boolean("has_image").default(false),
    imagePosition: varchar("image_position", { length: 50 }), // "header", "footer"

    // ========== SHOWCASE / PREVIEW ==========
    htmlTemplateName: varchar("html_template_name", { length: 255 }), // e.g., "wedding-classic"
    textContent: text("text_content"), // Readable message for showcase
    placeholders: jsonb("placeholders"), // {name: "", date: "", venue: "", time: ""}

    // ========== WHATSAPP CONTENT ==========
    templateName: varchar("template_name", { length: 255 }).unique(), // e.g., "wedding_classic_en"
    displayName: varchar("display_name", { length: 255 }), // For WhatsApp display
    templateBody: text("template_body"), // WhatsApp format: {{1}}, {{2}}, etc
    headerText: text("header_text"), // WhatsApp header
    footerText: text("footer_text"), // WhatsApp footer

    // ========== PARAMETERS ==========
    parameters: jsonb("parameters"), // Array: [{index, key, label}]
    example: jsonb("example"), // Example data

    // ========== WHATSAPP SPECIFIC ==========
    whatsappTemplateName: varchar("whatsapp_template_name", { length: 255 }), // Template reference
    whatsappCategory: varchar("whatsapp_category", { length: 100 }), // MARKETING, TRANSACTIONAL
    whatsappLanguageCode: varchar("whatsapp_language_code", { length: 10 }).default("en"),
    whatsappParameters: jsonb("whatsapp_parameters"), // Parameter mappings
    whatsappTemplateId: varchar("whatsapp_template_id", { length: 100 }).unique(), // Official WhatsApp ID
    whatsappStatus: varchar("whatsapp_status", { length: 50 }).default("PENDING_DELETION"), // APPROVED, PENDING, REJECTED
    whatsappApprovedAt: timestamp("whatsapp_approved_at"),
    whatsappRejectionReason: text("whatsapp_rejection_reason"),

    // ========== STATUS & FEATURES ==========
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false), // Homepage feature flag

    // ========== META DATA ==========
    templateJson: jsonb("template_json"), // Any additional JSON data

    // ========== TIMESTAMPS ==========
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_templates_category").on(table.category),
    isActiveIdx: index("idx_templates_is_active").on(table.isActive),
    templateNameIdx: index("idx_templates_template_name").on(table.templateName),
    whatsappTemplateIdIdx: index("idx_templates_whatsapp_template_id").on(table.whatsappTemplateId),
    whatsappStatusIdx: index("idx_templates_whatsapp_status").on(table.whatsappStatus),
    isFeaturedIdx: index("idx_templates_is_featured").on(table.isFeatured),
    createdAtIdx: index("idx_templates_created_at").on(table.createdAt),
  })
);

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
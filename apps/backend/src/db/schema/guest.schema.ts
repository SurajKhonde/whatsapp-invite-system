import { pgTable, uuid, varchar, text, integer, timestamp, boolean, index, foreignKey } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const guests = pgTable(
  "guests",
  {
    // ── Identity ──────────────────────────────────────────
    id: uuid("id").primaryKey().defaultRandom(),
    hostId: uuid("host_id").notNull(),
    
    // ── Contact Info ──────────────────────────────────────
    name: varchar("name", { length: 255 }).notNull(),
    phone: text("phone").notNull(),
    email: varchar("email", { length: 255 }),
    
    // ✅ KEPT — last 4 digits only, safe for masked display
    // e.g. "+91*****1234"
    phoneLast4: text("phone_last4"),
    
    countryCode: varchar("country_code", { length: 5 }).default("+91"),
    
    // ── Relation ──────────────────────────────────────────
    relation: varchar("relation", { length: 50 }).default("friend"),
    // "friend" | "family" | "colleague"
    
    // ── Status ────────────────────────────────────────────
    status: varchar("status", { length: 50 }).default("ACTIVE"),
    // "ACTIVE" | "INACTIVE" | "BLOCKED"
    
    // ── Verification ──────────────────────────────────────
    isWhatsappVerified: boolean("is_whatsapp_verified").default(false),
    
    // ── Invite Tracking ───────────────────────────────────
    // How many events this guest has been invited to
    inviteCount: integer("invite_count").default(0),
    lastInvitedAt: timestamp("last_invited_at"),
    
    // ── Timestamps ────────────────────────────────────────
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.hostId],
      foreignColumns: [users.id],
      name: "guests_user_id_fk",
    }).onDelete("cascade"),
    userIdIdx: index("idx_guests_user_id").on(table.hostId),
    phoneIdx: index("idx_guests_phone").on(table.phone),
    phoneLast4Idx: index("idx_guests_phone_last4").on(table.phoneLast4),
    emailIdx: index("idx_guests_email").on(table.email),
    statusIdx: index("idx_guests_status").on(table.status),
    createdAtIdx: index("idx_guests_created_at").on(table.createdAt),
  })
);

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = typeof guests.$inferInsert;
// apps/backend/src/db/schema/guest.schema.ts

import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const guests = pgTable(
  "guests",
  {
    // ── Identity ──────────────────────────────────────────
    id: uuid("id").defaultRandom().primaryKey(),

    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // ── Contact Info ──────────────────────────────────────
    name: text("name").notNull(),

    // AES-256-CBC encrypted — never stored as plain text
    phone: text("phone").notNull(),

    // ✅ ADDED — last 4 digits only, safe for masked display
    // e.g. "+91*****1234"
    // Populated at insert time from raw phone before encryption
    phoneLast4: text("phone_last4").notNull(),

    relation: text("relation").default("friend"),
    // "friend" | "family" | "colleague"

    // ── Status ────────────────────────────────────────────
    status: text("status").default("ACTIVE"),
    // "ACTIVE" | "INACTIVE" | "BLOCKED"

    // ── Invite Tracking ───────────────────────────────────
    // How many events this guest has been invited to
    inviteCount: integer("invite_count").default(0),
    lastInvitedAt: timestamp("last_invited_at", { mode: "date" }),

    // ── Timestamps ────────────────────────────────────────
    createdAt: timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    hostIdx:       index("idx_guests_host").on(table.hostId),
    phoneIdx:      index("idx_guests_phone").on(table.phone),
    // ✅ ADDED — fast lookup for masked display
    phoneLast4Idx: index("idx_guests_phone_last4").on(table.phoneLast4),
  })
);
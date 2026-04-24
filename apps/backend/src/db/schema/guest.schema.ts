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
    id: uuid("id").defaultRandom().primaryKey(),

    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    name: text("name").notNull(),
    phone: text("phone").notNull(),

    relation: text("relation").default("friend"),

    status: text("status").default("ACTIVE"),

    inviteCount: integer("invite_count").default(0),
    lastInvitedAt: timestamp("last_invited_at", { mode: "date" }),

    createdAt: timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    hostIdx: index("idx_guests_host").on(table.hostId),
    phoneIdx: index("idx_guests_phone").on(table.phone),
  })
);
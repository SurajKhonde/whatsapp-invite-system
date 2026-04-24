import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: text("email").notNull().unique(),
    password: text("password").notNull(),

    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    role: text("role").notNull().default("user"),

    emailOtp: integer("email_otp"),
    otpExpiresAt: timestamp("otp_expires_at"),
    otpPurpose: text("otp_purpose"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
  })
);
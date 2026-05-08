import { pgTable, uuid, varchar, timestamp, boolean, index, text } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    
    // Basic Info
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password_hash", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    
    // Role & Status
    role: varchar("role", { length: 50 }).default("user"),
    isActive: boolean("is_active").default(true),
    
    // Profile
    profileImageUrl: varchar("profile_image_url", { length: 500 }),
    
    // OTP Fields
    emailOtp: varchar("email_otp", { length: 10 }),
    otpExpiresAt: timestamp("otp_expires_at"),
    otpPurpose: varchar("otp_purpose", { length: 50 }),
    
    // Email Verification
    isEmailVerified: boolean("is_email_verified").default(false),
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    isActiveIdx: index("idx_users_is_active").on(table.isActive),
    emailOtpIdx: index("idx_users_email_otp").on(table.emailOtp),
    createdAtIdx: index("idx_users_created_at").on(table.createdAt),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
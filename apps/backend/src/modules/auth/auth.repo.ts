import { db } from "@/db/index";
import { users } from "@/db/schema/user.schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
  const userEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, userEmail));

  return user || null;
};

export const findUserById = async (id: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return user || null;
};

export const createUser = async ({
  email,
  password,
  emailOtp,
  otpExpiresAt,
  role = "user",
  otpPurpose,
}: {
  email: string;
  password: string;
  emailOtp: string;
  otpExpiresAt: Date;
  role?: string;
  otpPurpose: string;
}) => {
  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase().trim(),
      password,
      emailOtp,
      otpExpiresAt,
      role,
      otpPurpose,
      isEmailVerified: false,
    })
    .returning({ id: users.id, email: users.email });

  return user;
};

export const verifySignupUser = async (email: string) => {
  const userEmail = email.toLowerCase().trim();

  await db
    .update(users)
    .set({
      isEmailVerified: true,
      emailOtp: null,
      otpExpiresAt: null,
      otpPurpose: null,
      updatedAt: new Date(),
    })
    .where(eq(users.email, userEmail));
};

export const clearOtp = async (email: string) => {
  const userEmail = email.toLowerCase().trim();

  await db
    .update(users)
    .set({
      emailOtp: null,
      otpExpiresAt: null,
      otpPurpose: null,
      updatedAt: new Date(),
    })
    .where(eq(users.email, userEmail));
};

export const updateOtp = async (
  email: string,
  emailOtp: string,
  otpExpiresAt: Date,
  otpPurpose: "signup" | "forgot-password"
) => {
  const userEmail = email.toLowerCase().trim();

  await db
    .update(users)
    .set({
      emailOtp,
      otpExpiresAt,
      otpPurpose,
      updatedAt: new Date(),
    })
    .where(eq(users.email, userEmail));
};

export const updatePassword = async (
  email: string,
  password: string
) => {
  const userEmail = email.toLowerCase().trim();

  await db
    .update(users)
    .set({
      password,
      emailOtp: null,
      otpExpiresAt: null,
      otpPurpose: null,
      updatedAt: new Date(),
    })
    .where(eq(users.email, userEmail));
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    profileImageUrl?: string;
    isActive?: boolean;
  }
) => {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return user;
};
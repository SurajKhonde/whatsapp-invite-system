import bcrypt from "bcrypt";
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";
import {
  findUserByEmail,
  createUser,
  verifySignupUser,
  clearOtp,
} from "./auth.repo";
import { otpQueue } from "@queue/emailOTP.queue";

const SALT_ROUNDS = 10;


// 🔥 SIGNUP
export const signupService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await createUser({
    email,
    password: hashedPassword,
    otp,
    otpExpiry,
    purpose: "signup", 
  });

  await otpQueue.add("sendOTP", {
    email,
    otp,
    purpose: "signup",
  });

  logger.info({ userId: user.id }, "Signup success, OTP queued");

  return {
    message: "Signup successful, verify OTP",
  };
};



// 🔥 VERIFY OTP
export const verifyOtpService = async ({
  email,
  otp,
  purpose,
}: {
  email: string;
  otp: number;
  purpose: "signup" | "forgot_password";
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.email_otp !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (user.otp_purpose !== purpose) {
    throw new AppError("Invalid OTP purpose", 400);
  }

  if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  if (purpose === "signup") {
    await verifySignupUser(email);
  } else {
    await clearOtp(email);
  }

  logger.info({ email, purpose }, "OTP verified");

  return {
    message: "OTP verified successfully",
  };
};
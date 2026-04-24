import bcrypt from "bcrypt";
import { AppError } from "@core/errors/AppError";
import jwt from "jsonwebtoken";
import { logger } from "@core/logger/logger";
import {redisCache} from "@config/redis"
import {
  findUserByEmail,
  createUser,
  verifySignupUser,
  clearOtp,
} from "./auth.repo";
import{updateOtp, updatePassword} from "./auth.repo";
import { otpQueue } from "@queue/emailOTP.queue";
import {validateEmail, validatePassword, validateName} from "./auth.validators";
const SALT_ROUNDS = 10;


// 🔥 SIGNUP
export const signupService = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) => {

  // ✅ Trim + normalize
  email = email.trim().toLowerCase();
  password = password.trim();
  name = name?.trim();
  // ✅ Required fields
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // ✅ Email format
  if (!validateEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }

  // ✅ Password strength
  if (!validatePassword(password)) {
    throw new AppError(
      "Password must be at least 8 characters and contain at least one letter",
      400
    );
  }

  // ✅ Name validation (optional)
  if (name && !validateName(name)) {
    throw new AppError(
      "Name should not contain numbers or special characters",
      400
    );
  }

  // ✅ Unique email
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // ✅ Hash password (ALWAYS)
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // ✅ OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await createUser({
    email:email.toLowerCase(),
    password: hashedPassword,
    otp,
    otpExpiry,
    role:"admin",
    purpose: "signup",
  });

  // ✅ Queue OTP
  await otpQueue.add("sendOTP", {
    email,
    otp,
    purpose: "signup",
  });

  logger.info({ userId: user.id }, "Signup success, OTP queued");
const token = jwt.sign(
  { userId: user.id ,role:user.role},
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

  return { token}
 
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
  if (Number(user.email_otp) !== Number(otp)) {

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
export const resendOtpService = async ({
  email,
  purpose,
}: {
  email: string;
  purpose: "signup" | "forgot_password";
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.otp_purpose !== purpose) {
    throw new AppError("Invalid OTP purpose", 400);
  }
  let otp = user.email_otp;
  let otpExpiry = user.otp_expires_at;

  if (!otpExpiry || new Date(otpExpiry) < new Date()) {
    otp = Math.floor(100000 + Math.random() * 900000);
    otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await updateOtp(email, otp, otpExpiry, purpose);
  }

  await otpQueue.add("sendOTP", {
    email:email.toLowerCase(),
    otp,
    purpose,
  });

  logger.info({ email, purpose  }, "OTP resent");

  return {
    message: "OTP resent successfully",
  };
};


export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

  return { token}
};
export const forgotPasswordService = async ({
  email,
}: {
  email: string;
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await updateOtp(email, otp, otpExpiry, "forgot_password");

  await otpQueue.add("sendOTP", {
    email,
    otp,
    purpose: "forgot_password",
  });

  return {
    message: "OTP sent to email",
  };
};
export const resetPasswordService = async ({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: number;
  newPassword: string;
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.email_otp !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await updatePassword(email, hashedPassword);

  await clearOtp(email);

  return {
    message: "Password reset successful",
  };
};

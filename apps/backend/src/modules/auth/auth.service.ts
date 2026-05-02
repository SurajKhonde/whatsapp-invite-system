import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "@core/errors/AppError";
import {
  findUserByEmail,
  findUserById,
  createUser,
  verifySignupUser,
  clearOtp,
  updateOtp,
  updatePassword,
} from "./auth.repo";
import { otpQueue } from "@queue/emailOTP.queue";

const SALT_ROUNDS = 10;

const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

type SignupInput = {
  email: string;
  password: string;
  name?: string;
  role: string;
};

type VerifyOtpInput = {
  email: string;
  otp: number;
  purpose: "signup" | "forgot-password";
};

type LoginInput = {
  email: string;
  password: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ChangePasswordInput = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};

type ResendOtpInput = {
  email: string;
  purpose: "signup" | "forgot-password";
};

// 🔥 SIGNUP
export const signupService = async ({
  email,
  password,
  role,
}: SignupInput) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = normalizeEmail(email);

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await createUser({
    email,
    password: hashedPassword,
    otp,
    otpExpiry,
    role,
    purpose: "signup",
  });

  await otpQueue.add("sendOTP", { email, otp, purpose: "signup" });

  const token: string = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    message: "Signup successful & OTP sent",
    data: { token },
    notify: true,
  };
};

// 🔥 VERIFY OTP
export const verifyOtpService = async ({
  email,
  otp,
  purpose,
}: VerifyOtpInput) => {
  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

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

  return {
    message: "OTP verified successfully",
    notify: true,
  };
};

// 🔥 LOGIN
export const loginService = async ({
  email,
  password,
}: LoginInput) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    message: "Login successful",
    data: { token },
    notify: true,
  };
};

// 🔥 FORGOT PASSWORD
export const forgotPasswordService = async ({
  email,
}: ForgotPasswordInput) => {
  if (!email) throw new AppError("Email is required", 400);

  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await updateOtp(email, otp, otpExpiry, "forgot-password");

  await otpQueue.add("sendOTP", {
    email,
    otp,
    purpose: "forgot-password",
  });

  return {
    message: "OTP sent successfully",
    notify: true,
  };
};

// 🔥 CHANGE PASSWORD
export const changePasswordService = async ({
  userId,
  oldPassword,
  newPassword,
}: ChangePasswordInput) => {
  if (!oldPassword || !newPassword) {
    throw new AppError("All fields are required", 400);
  }

  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new AppError("Old password is incorrect", 400);

  if (oldPassword === newPassword) {
    throw new AppError("New password must be different", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await updatePassword(user.email, hashedPassword);

  return {
    message: "Password updated successfully",
    notify: true,
  };
};

// 🔥 RESEND OTP
export const resendOtpService = async ({
  email,
  purpose,
}: ResendOtpInput) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  email = normalizeEmail(email);

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
    email,
    otp,
    purpose,
  });

  return {
    message: "OTP resent successfully",
    notify: true,
  };
};

// 🔥 RESET PASSWORD
export const resetNewPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new AppError("Email and new password are required", 400);
  }

  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await updatePassword(user.email, hashedPassword);

  return {
    message: "Password updated successfully",
    notify: true,
  };
};
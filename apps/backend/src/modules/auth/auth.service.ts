
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
import {invalidateUserCache} from "@utils/invalidateRedis"
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

interface UserResponseData {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isActive: boolean;
  profileImageUrl?: string;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: UserResponseData;
  };
  notify: boolean;
}

// ============================================================================
// 🔥 SIGNUP
// ============================================================================
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
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await createUser({
    email,
    password: hashedPassword,
    emailOtp: String(otp),
    otpExpiresAt,
    role,
    otpPurpose: "signup",
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

// ============================================================================
// 🔥 VERIFY OTP
// ============================================================================
export const verifyOtpService = async ({
  email,
  otp,
  purpose,
}: VerifyOtpInput) => {
  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  if (Number(user.emailOtp) !== Number(otp)) {
    throw new AppError("Invalid OTP", 400);
  }

  if (user.otpPurpose !== purpose) {
    throw new AppError("Invalid OTP purpose", 400);
  }

  if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  if (purpose === "signup") {
    await verifySignupUser(email);
  } else {
    await clearOtp(email);
  }
   await invalidateUserCache(user.id)
   // ✅ Return fresh user data after OTP verification
  const userData: UserResponseData = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    role: user.role as "user" | "admin",
    isEmailVerified: user.isEmailVerified ?? false,
    isActive : user.isActive ,
    profileImageUrl: user.profileImageUrl || undefined,
  };

  return {
    message: "OTP verified successfully",
    data: { user: userData },
    notify: true,
  };
};

// ============================================================================
// 🔥 LOGIN
// ============================================================================
export const loginService = async ({
  email,
  password,
}: LoginInput): Promise<LoginResponse> => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 400);

  // ✅ Check if password exists before bcrypt
  if (!user.password) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  // ✅ Create light token with only userId
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // ✅ Return user data immediately
  const userData: UserResponseData = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    role: user.role as "user" | "admin",
    isEmailVerified: user.isEmailVerified ?? false,
    isActive: user.isActive,
    profileImageUrl: user.profileImageUrl || undefined,
  };

  return {
    message: "Login successful",
    data: {
      token,
      user: userData,
    },
    notify: true,
  };
};

// ============================================================================
// 🔥 FORGOT PASSWORD
// ============================================================================
export const forgotPasswordService = async ({
  email,
}: ForgotPasswordInput) => {
  if (!email) throw new AppError("Email is required", 400);

  email = normalizeEmail(email);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await updateOtp(email, String(otp), otpExpiresAt, "forgot-password");

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

// ============================================================================
// 🔥 CHANGE PASSWORD
// ⚠️ REQUIRES userId FROM AUTH MIDDLEWARE
// ============================================================================
export const changePasswordService = async ({
  userId,        // ← FROM AUTH MIDDLEWARE
  oldPassword,
  newPassword,
}: ChangePasswordInput) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!oldPassword || !newPassword) {
    throw new AppError("All fields are required", 400);
  }

  // ✅ Find user by userId from middleware
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  // ✅ Check if password exists before bcrypt
  if (!user.password) {
    throw new AppError("Old password is incorrect", 400);
  }

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

// ============================================================================
// 🔥 RESEND OTP
// ============================================================================
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

  if (user.otpPurpose !== purpose) {
    throw new AppError("Invalid OTP purpose", 400);
  }

  let otp = user.emailOtp;
  let otpExpiresAt = user.otpExpiresAt;

  if (!otpExpiresAt || new Date(otpExpiresAt) < new Date()) {
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await updateOtp(email, String(newOtp), otpExpiresAt, purpose);
    otp = String(newOtp);
  }

  // Convert to number for queue
  const otpNumber = typeof otp === "string" ? parseInt(otp, 10) : otp;

  await otpQueue.add("sendOTP", {
    email,
    otp: otpNumber,
    purpose,
  });

  return {
    message: "OTP resent successfully",
    notify: true,
  };
};

// ============================================================================
// 🔥 RESET PASSWORD (Forgot Password Flow)
// ============================================================================
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


export const getMeService = async (userId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  // ✅ Find user by userId from middleware
  const user = await findUserById(userId);
  if (!user || !user.isActive) {
    throw new AppError("User not found or account inactive", 404);
  }

  const userData: UserResponseData = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    role: user.role as "user" | "admin",
    isEmailVerified: user.isEmailVerified ?? false,
    isActive:user.isActive,
    profileImageUrl: user.profileImageUrl || undefined,
  };

  return {
    message: "User profile retrieved",
    data: userData,
    notify: false,
  };
};
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";
import { pool } from "@config/db";

export const verifyOtpService = async ({
  email,
  otp,
  purpose,
}: {
  email: string;
  otp: number;
  purpose: "signup" | "forgot_password";
}) => {
  const res = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = res.rows[0];

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // ❌ wrong OTP
  if (user.email_otp !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  // ❌ wrong purpose
  if (user.otp_purpose !== purpose) {
    throw new AppError("Invalid OTP purpose", 400);
  }

  // ❌ expired
  if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  // ✅ signup flow
  if (purpose === "signup") {
    await pool.query(
      `UPDATE users 
       SET is_email_verified = true,
           email_otp = NULL,
           otp_expires_at = NULL,
           otp_purpose = NULL
       WHERE email = $1`,
      [email]
    );
  }

  // ✅ forgot password → just validate OTP (don’t verify email again)
  if (purpose === "forgot_password") {
    await pool.query(
      `UPDATE users 
       SET email_otp = NULL,
           otp_expires_at = NULL,
           otp_purpose = NULL
       WHERE email = $1`,
      [email]
    );
  }

  logger.info({ email, purpose }, "OTP verified");

  return {
    message: "OTP verified successfully",
  };
};
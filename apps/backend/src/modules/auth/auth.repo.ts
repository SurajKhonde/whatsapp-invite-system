import { pool } from "@config/db";

export const findUserByEmail = async (email: string) => {
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
};

export const createUser = async ({
  email,
  password,
  otp,
  otpExpiry,
  purpose,
}: {
  email: string;
  password: string;
  otp: number;
  otpExpiry: Date;
  purpose: string;
}) => {
  const res = await pool.query(
    `INSERT INTO users 
     (email, password, email_otp, otp_expires_at, otp_purpose)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email`,
    [email, password, otp, otpExpiry, purpose]
  );

  return res.rows[0];
};

export const verifySignupUser = async (email: string) => {
  await pool.query(
    `UPDATE users 
     SET is_email_verified = true,
         email_otp = NULL,
         otp_expires_at = NULL,
         otp_purpose = NULL
     WHERE email = $1`,
    [email]
  );
};

export const clearOtp = async (email: string) => {
  await pool.query(
    `UPDATE users 
     SET email_otp = NULL,
         otp_expires_at = NULL,
         otp_purpose = NULL
     WHERE email = $1`,
    [email]
  );
};
import { pool } from "@config/db";

export const findUserByEmail = async (email: string) => {
  const userEmail = email.toLowerCase();
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [userEmail]
  );
  return res.rows[0];
};

export const createUser = async ({
  email,
  password,
  otp,
  otpExpiry,
  role,
  purpose,
}: {
  email: string;
  password: string;
  otp: number;
  otpExpiry: Date;
  role:string;
  purpose: string;
}) => {
  const res = await pool.query(
    `INSERT INTO users 
     (email, password, email_otp, otp_expires_at,role,otp_purpose )
     VALUES ($1, $2, $3, $4, $5,$6)
     RETURNING id, email`,
    [email, password, otp, otpExpiry, role, purpose]
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
export const updateOtp = async (
  email: string,
  otp: number,
  otpExpiry: Date,
  purpose: "signup" | "forgot_password"
) => {
  await pool.query(
    `UPDATE users 
     SET email_otp = $1,
         otp_expires_at = $2,
         otp_purpose = $3
     WHERE email = $4`,
    [otp, otpExpiry, purpose, email]
  );
};
export const updatePassword = async (
  email: string,
  hashedPassword: string
) => {
  await pool.query(
    `UPDATE users 
     SET password = $1,
         email_otp = NULL,
         otp_expires_at = NULL,
         otp_purpose = NULL
     WHERE email = $2`,
    [hashedPassword, email]
  );
};
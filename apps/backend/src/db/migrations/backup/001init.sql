CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,

  is_email_verified BOOLEAN NOT NULL DEFAULT false,

  email_otp INTEGER,
  otp_expires_at TIMESTAMP,
  otp_purpose TEXT DEFAULT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
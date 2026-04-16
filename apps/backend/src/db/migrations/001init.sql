-- 001_init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,

  is_email_verified BOOLEAN NOT NULL DEFAULT false,

  email_otp INTEGER,
  otp_expires_at TIMESTAMP,
  otp_purpose TEXT DEFAULT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- indexes (important)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
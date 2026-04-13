import { Request, Response } from "express";
type User = {
  name: string;
  email: string;
  password: string;
  otp: number;
  isVerified: boolean;
};

const users: User[] = [];

export const signup = (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = users.find((u) => u.email === email);

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const newUser: User = {
    name,
    email,
    password,
    otp,
    isVerified: false,
  };

  users.push(newUser);

  console.log("📩 OTP:", otp);

  return res.json({
    message: "Signup successful, verify OTP",
  });
};

export const verify = (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user || user.otp !== Number(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;

  return res.json({ message: "Verified successfully" });
};
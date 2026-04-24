import { Request, Response, NextFunction } from "express";
import {
  signupService,
  verifyOtpService,
  resendOtpService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "./auth.service";

// 🔥 SIGNUP
export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {token} = await signupService(req.body);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    next(err);
  }
};
export const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyOtpService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
export const resendOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resendOtpService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔥 LOGIN (Cookie-based)
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await loginService(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

// 🔥 FORGOT PASSWORD
export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await forgotPasswordService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔥 RESET PASSWORD
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resetPasswordService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔥 LOGOUT
export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
};

export const getMe = (req: Request, res: Response) => {
  // user already attached in authMiddleware
  res.json({
    success: true,
    data: req.user,
  });
};
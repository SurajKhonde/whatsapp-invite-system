import { Request, Response, NextFunction } from "express";
import {
  signupService,
  verifyOtpService,
  resendOtpService,
  loginService,
  forgotPasswordService,
  changePasswordService,
  resetNewPassword,
} from "./auth.service";
import { sendResponse } from "@utils/response";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ✅ SIGNUP
export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signupService(req.body);

    const token = result.data?.token;
    if (token) {
      res.cookie("access_token", token, cookieOptions);
    }

    return sendResponse({
      res,
      statusCode: 201,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ VERIFY OTP
export const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyOtpService(req.body);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ RESEND OTP
export const resendOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resendOtpService(req.body);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ LOGIN
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginService(req.body);

    const token = result.data?.token;
    if (token) {
      res.cookie("access_token", token, cookieOptions);
    }

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ FORGOT PASSWORD
export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await forgotPasswordService(req.body);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ CHANGE PASSWORD
export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await changePasswordService(req.body);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ RESET PASSWORD
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resetNewPassword(req.body);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ LOGOUT
export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("access_token", cookieOptions);

  return sendResponse({
    res,
    message: "Logged out successfully",
    notify: true,
  });
};

// ✅ GET ME (NO TOAST 🔥)
export const getMe = (req: Request, res: Response) => {
  return sendResponse({
    res,
    message: "User fetched",
    data: req.user,
    notify: false,
  });
};
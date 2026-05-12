import { Request, Response, NextFunction } from "express";
import {
  signupService,
  verifyOtpService,
  resendOtpService,
  loginService,
  forgotPasswordService,
  changePasswordService,
  resetNewPassword,
  getMeService,
} from "./auth.service";
import { sendResponse } from "@utils/response";
import {invalidateUserCache} from "@utils/invalidateRedis"
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ✅ SIGNUP
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);

    const token = result.data?.token;
    if (token) {
      res.cookie("access_token", token, cookieOptions);
    }

    return sendResponse({
      res,
      statusCode: 200,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ FORGOT PASSWORD
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
// ⚠️ PROTECTED ROUTE - Requires authentication
export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Extract userId from auth middleware
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        message: "Unauthorized - User ID not found",
        notify: true,
      });
    }

    const result = await changePasswordService({
      ...req.body,
      userId, // ← Pass extracted userId
    });

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ RESET PASSWORD
// For forgot password flow (after OTP verified)
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
// ⚠️ PROTECTED ROUTE - Requires authentication
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
 
     if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        message: "Unauthorized - User ID not found",
        notify: true,
      });
    }
 
    // ✅ CLEAR USER CACHE FROM REDIS
    // Remove the user's verification cache so it can't be reused
    await invalidateUserCache(userId);
 
    console.log(`✅ User ${userId} logged out - cache cleared`);
 
    // ✅ CLEAR HTTPONLY COOKIE
    // Backend clears the cookie by sending empty value
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
 
    // ✅ RETURN SUCCESS
    res.json({
      message: "Logged out successfully",
      data: { success: true },
    });
  } catch (err) {
    next(err);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Extract userId from auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        message: "Unauthorized - User ID not found",
        notify: true,
      });
    }

    // ✅ Call service with userId
    const result = await getMeService(userId);

    return sendResponse({
      res,
      statusCode: 200,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
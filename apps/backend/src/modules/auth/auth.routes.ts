import { Router } from "express";
import {
  signupController,
  verifyOtpController,
  resendOtpController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
  logoutController,
  getMeController
} from "./auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateSignup } from "@middlewares/validate.middleware";
import { rateLimiter  } from "@middlewares/enhancedratelimiter.middleware";
const router = Router();
router.post(
  "/signup",
  rateLimiter("AUTH", "signup"), 
  validateSignup,
  signupController
);
router.post(
  "/login",
  rateLimiter("AUTH", "login"), 
  loginController
);


router.post(
  "/verify-otp",
  rateLimiter("AUTH", "verifyOtp"),
  verifyOtpController
);

router.post(
  "/resend-otp",
  rateLimiter("AUTH", "signup"), 
  resendOtpController
);


router.post(
  "/forgot-password",
  rateLimiter("AUTH", "forgotPassword"), 
  forgotPasswordController
);

router.post(
  "/reset-password",
  rateLimiter("AUTH", "resetPassword"),
  resetPasswordController
);


router.get(
  "/me",
  authMiddleware,
  rateLimiter("GENERAL", "default"), 
  getMeController
);


router.post(
  "/reset-old-password",
  authMiddleware,
  rateLimiter("AUTH", "resetPassword"),
  changePasswordController
);

router.post(
  "/logout",
  authMiddleware,
  rateLimiter("GENERAL", "default"),
  logoutController
);

export default router;
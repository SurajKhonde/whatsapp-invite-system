import { Router } from "express";
import {
  signupController,
  verifyOtpController,
  resendOtpController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  getMe
} from "./auth.controller";
import { rateLimiter } from "@middlewares/rateLimiter";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateSignup } from "@middlewares/validate.middleware";

const router = Router();

router.post("/signup", validateSignup, signupController);

router.post("/verify-otp",rateLimiter({
    limit: 3,
    windowSec: 60,
    keyPrefix: "verify:otp",
  }), verifyOtpController);

router.post("/resend-otp",  rateLimiter({
    limit: 3,
    windowSec: 600,
    keyPrefix: "rate:otp",
  }),resendOtpController);

router.post("/login",  rateLimiter({
    limit: 5,
    windowSec: 300,
    keyPrefix: "rate:login",
  }),loginController);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password",authMiddleware, resetPasswordController);

router.post("/logout", authMiddleware, logoutController);

export default router;
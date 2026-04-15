import express from "express";
import { signup } from "@modules/auth/auth.controller";
import {verifyOtp} from "@modules/emailOtpManger/emailOTP.controller";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/verify-otp", verifyOtp);

export default router;
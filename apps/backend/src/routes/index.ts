import express from "express";
import { signup } from "@modules/auth/auth.controller";
import {verifyOtp} from "@modules/emailOtpManger/emailOTP.controller";
import guestRoutes from "@modules/guest/guest.routes";


const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/verify-otp", verifyOtp);
router.use("/guests", guestRoutes);

export default router;
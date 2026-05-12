// src/modules/payment/payment.routes.ts

import { Router } from "express";
import express from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter  } from "@middlewares/enhancedratelimiter.middleware";
import {
  createPaymentOrder,
  verifyPaymentHandler,
  webhookHandler,
  getMyPlan,
} from "./payment.controller";

const router = Router();


router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  rateLimiter("PAYMENT", "verifyPayment"),   
  webhookHandler
);


router.use(authMiddleware);           // Step 1: Verify JWT token
router.use(verifyUserMiddleware);     // Step 2: Check user verified in database


router.post(
  "/create-order",
  rateLimiter("PAYMENT", "createOrder"),  // Strict rate limit (10/hour)
  createPaymentOrder                      // Create payment order
);


router.post(
  "/verify",
  rateLimiter("PAYMENT", "verifyPayment"),  // Strict rate limit (15/hour)
  verifyPaymentHandler                      // Verify payment
);

router.get(
  "/plan",
  rateLimiter("PAYMENT", "getPayments"),  // Moderate rate limit (30/hour)
  getMyPlan                                // Get user's plan
);

export default router;
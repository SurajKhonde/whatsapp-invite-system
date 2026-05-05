import { Router } from "express";
import express from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
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
  webhookHandler
);
 router.use(authMiddleware);

router.post("/create-order",  createPaymentOrder);
router.post("/verify", verifyPaymentHandler);
router.get("/plan",    getMyPlan);            
export default router;
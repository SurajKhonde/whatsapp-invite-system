import express from "express";
import { createInvite } from "./invite.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter, lenientRateLimiter } from "@middlewares/enhancedratelimiter.middleware";

const router = express.Router();

router.post(
  "/invite-imagegenrator",
  authMiddleware,                 
  verifyUserMiddleware,            
  rateLimiter("GENERAL", "inviteSender"),
  createInvite                
);

export default router;
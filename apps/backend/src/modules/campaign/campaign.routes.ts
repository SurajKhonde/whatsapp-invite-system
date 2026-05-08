import { Router } from "express";
import { campaignController } from "./campaign.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { rateLimiter } from "@middlewares/rateLimiter";

const router = Router();

// ✅ START CAMPAIGN (Send WhatsApp invites)
router.post(
  "/start",
  authMiddleware,
  rateLimiter({
    limit: 5,
    windowSec: 300,
    keyPrefix: "rate:campaign:start",
  }),
  campaignController.start
);

// ✅ GET ALL EVENTS
router.get("/", authMiddleware, campaignController.getAll);

// ✅ GET EVENT DETAILS (NEW)
router.get(
  "/:eventId/details",
  authMiddleware,
  campaignController.getDetails
);

// ✅ GET CAMPAIGN STATUS
router.get(
  "/:eventId/status",
  authMiddleware,
  campaignController.getStatus
);

// ✅ RETRY FAILED GUESTS (NEW)
router.post(
  "/:eventId/retry",
  authMiddleware,
  rateLimiter({
    limit: 5,
    windowSec: 300,
    keyPrefix: "rate:campaign:retry",
  }),
  campaignController.retryFailed
);

// ✅ CANCEL CAMPAIGN
router.delete(
  "/:eventId",
  authMiddleware,
  campaignController.cancel
);

export default router;
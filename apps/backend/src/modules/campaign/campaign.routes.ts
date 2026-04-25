import { Router } from "express";
import { EventController } from "./campaign.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { rateLimiter } from "@middlewares/rateLimiter";

const router = Router();
const controller = new EventController();

// ✅ CREATE
router.post(
  "/",
  authMiddleware,
  rateLimiter({
    limit: 5,
    windowSec: 300,
    keyPrefix: "rate:create:event",
  }),
  controller.create
);

// ✅ GET ALL
router.get("/", authMiddleware, controller.getAll);

// ✅ GET ONE
router.get("/:id", authMiddleware, controller.getOne);

export default router;
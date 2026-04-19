import { Router } from "express";
import { addGuests, getGuests,revealController } from "./guest.controller";
import {authMiddleware} from "@middlewares/auth.middleware";
import { rateLimiter } from "@middlewares/rateLimiter";
const router = Router();

router.post("/bulk",authMiddleware, addGuests);
router.get("/", authMiddleware, getGuests);


router.post(
  "/guests/reveal",
  rateLimiter({
    limit: 5,         
    windowSec: 60,     
    keyPrefix: "rate:reveal",
  }),
  revealController
);

export default router;
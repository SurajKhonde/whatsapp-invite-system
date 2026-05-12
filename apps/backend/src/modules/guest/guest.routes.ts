// src/modules/guest/guest.routes.ts

import { Router } from "express";
import { addGuests, getGuests, revealController } from "./guest.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter} from "@middlewares/enhancedratelimiter.middleware";

const router = Router();


router.post(
  "/bulk",
  authMiddleware,                   
  verifyUserMiddleware,             
  rateLimiter("EVENT", "addGuest"),
  addGuests                        
);


router.get(
  "/",
  authMiddleware,                        
  rateLimiter("EVENT", "list"),   
  getGuests                       
);

router.post(
  "/guests/reveal",
  authMiddleware,
  rateLimiter("EVENT", "addGuest"), 
  revealController                  
);

export default router;

import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  getEventStatus,
  updateEvent,
  deleteEvent,
  resendEvent,
} from "./event.controller";

import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter } from "@middlewares/enhancedratelimiter.middleware";

const router = Router();
router.post(
  "/",
  authMiddleware,                
  verifyUserMiddleware,            
  rateLimiter("EVENT", "create"),  
  createEvent                     
);

router.get(
  "/",
  authMiddleware,                          
  rateLimiter("EVENT", "list"),   
  getEvents                       
);

router.get(
  "/:id",
  authMiddleware,                           
  rateLimiter("EVENT", "list"),   
  getEventById                 
);

router.get(
  "/:eventId/status",
  authMiddleware,                            
  rateLimiter("EVENT", "list"),   
  getEventStatus               
);

router.patch(
  "/:id",
  authMiddleware,                 
  verifyUserMiddleware,           
  rateLimiter("EVENT", "update"), 
  updateEvent                   
);

router.delete(
  "/:id",
  authMiddleware,       
  verifyUserMiddleware,     
  rateLimiter("EVENT", "delete"),
  deleteEvent                     
);

router.post(
  "/:id/resend",
  authMiddleware,                 
  verifyUserMiddleware,           
  rateLimiter("EVENT", "addGuest"),
  resendEvent                
);

export default router;
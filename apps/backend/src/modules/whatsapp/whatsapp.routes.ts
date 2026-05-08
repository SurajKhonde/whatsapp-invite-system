import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import {
  getWhatsappTemplates,
  getWhatsappTemplate,
  generateImage,
  getImageStatus,
  createEvent,
  getEventStatus,
  getEvents,
} from "./whatsapp.controller";

const router = Router();


router.get("/templates", authMiddleware, getWhatsappTemplates);


router.get("/templates/:templateId", authMiddleware, getWhatsappTemplate);


router.post("/images/generate", authMiddleware, generateImage);


router.get("/images/:jobId/status", authMiddleware, getImageStatus);


router.post("/events", authMiddleware, createEvent);


router.get("/events/:eventId/status", authMiddleware, getEventStatus);


router.get("/events", authMiddleware, getEvents);

export default router;
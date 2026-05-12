// src/modules/whatsapp/whatsapp.routes.ts

import { Router } from "express";

import { authMiddleware }
from "@middlewares/auth.middleware";

import {
  getWhatsappTemplates,
  getWhatsappTemplate,
 
} from "./whatsapp.controller";

const router = Router();

/**
 * ============================================
 * TEMPLATE ROUTES
 * ============================================
 */

router.get(
  "/templates",
  authMiddleware,
  getWhatsappTemplates
);

router.get(
  "/templates/:templateId",
  authMiddleware,
  getWhatsappTemplate
);

/**


export default router;


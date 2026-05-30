// src/modules/admin-templates/admin-templates.routes.ts
import { Router } from "express";
import { adminTemplatesController } from "./admin-templates.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";

const router = Router();

router.get(
  "/export/:templateId",
  authMiddleware,
  verifyUserMiddleware,
  adminTemplatesController.exportTemplate
);

router.get(
  "/export",
  authMiddleware,
  verifyUserMiddleware,
  adminTemplatesController.exportAllTemplates
);

router.post(
  "/import",
  authMiddleware,
  verifyUserMiddleware,
  adminTemplatesController.importTemplate
);

export default router;
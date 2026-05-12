// src/modules/text-template/text-template.routes.ts

import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter, lenientRateLimiter } from "@middlewares/enhancedratelimiter.middleware";
import {
  textTemplateController,
} from "./text-template.controller";

const router = Router();


router.post(
  "/",
  authMiddleware,
  verifyUserMiddleware,
  rateLimiter("GENERAL", "default"),
  textTemplateController.create
);


router.get(
  "/categories",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getCategories
);


router.get(
  "/text",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getTextTemplates
);


router.get(
  "/images",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getImageTemplates
);

router.get(
  "/",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getAll
);

router.get(
  "/category/:category",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getByCategory
);


router.get(
  "/:id",
  authMiddleware,
  lenientRateLimiter(3600, 200),
  textTemplateController.getById
);

router.delete(
  "/:id",
  authMiddleware,
  verifyUserMiddleware,
  rateLimiter("EVENT", "delete"),
  textTemplateController.delete
);

export default router;
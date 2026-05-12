// src/modules/image-generation/image-generation.routes.ts

import { Router } from "express";
import { imageGenerationController } from "./image-generation.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { verifyUserMiddleware } from "@middlewares/verifyuser.middleware";
import { rateLimiter, strictRateLimiter } from "@middlewares/enhancedratelimiter.middleware";

const router = Router();


router.post(
  "/register-image-template",
  authMiddleware,                                   // Step 1: Verify JWT token
  verifyUserMiddleware,                            // Step 2: Check user verified in DB
  strictRateLimiter(3600, 10),                     // Step 3: Strict rate limit (10/hour)
  imageGenerationController.registerImageTemplate // Step 4: Register template
);

/**
 * ============================================================================
 * ADDITIONAL ENDPOINTS (RECOMMENDATIONS FOR FUTURE IMPLEMENTATION)
 * ============================================================================
 * 
 * These are suggested endpoints to complement image generation functionality:
 * 
 * 1. GET /api/image-generation/templates
 *    Purpose: List user's templates
 *    Rate Limit: 30/hour
 *    Auth: YES
 * 
 * 2. GET /api/image-generation/templates/:templateId
 *    Purpose: Get specific template details
 *    Rate Limit: 100/hour
 *    Auth: YES
 * 
 * 3. DELETE /api/image-generation/templates/:templateId
 *    Purpose: Delete a template
 *    Rate Limit: 5/hour (destructive)
 *    Auth: YES
 * 
 * 4. POST /api/image-generation/generate
 *    Purpose: Generate invitation image from template
 *    Rate Limit: 20/hour (CPU intensive)
 *    Auth: YES
 * 
 * 5. POST /api/image-generation/preview
 *    Purpose: Preview image before generation
 *    Rate Limit: 50/hour
 *    Auth: YES
 * 
 * Example implementation:
 * 
 * router.get(
 *   "/templates",
 *   authMiddleware,
 *   verifyUserMiddleware,
 *   rateLimiter("GENERAL", "default"),  // or custom rate limit
 *   imageGenerationController.listTemplates
 * );
 * 
 * router.post(
 *   "/generate",
 *   authMiddleware,
 *   verifyUserMiddleware,
 *   strictRateLimiter(3600, 20),  // Strict because CPU intensive
 *   imageGenerationController.generateImage
 * );
 */

export default router;
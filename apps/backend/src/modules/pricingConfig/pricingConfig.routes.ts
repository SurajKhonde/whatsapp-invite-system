import { Router, Request, Response } from "express";
import { pricingConfigController } from "./pricingConfig.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { lenientRateLimiter } from "@middlewares/enhancedratelimiter.middleware";

const router = Router();


router.get(
  "/:messageType",
  
  lenientRateLimiter(3600, 200),  
  authMiddleware,
  (req: Request, res: Response) => {
    pricingConfigController.getPricingConfigByType(req, res);
  }
);

router.get(
  "/",
  lenientRateLimiter(3600, 200),  
  authMiddleware,
  (req: Request, res: Response) => {
    pricingConfigController.getAllPricingConfigs(req, res);
  }
);

router.get(
  "/featured",
  lenientRateLimiter(3600, 200),  
  authMiddleware,
  (req: Request, res: Response) => {
    pricingConfigController.getFeaturedPricingConfigs(req, res);
  }
);


router.post(
  "/calculate",
  lenientRateLimiter(3600, 100),
  authMiddleware,
  (req: Request, res: Response) => {
    pricingConfigController.calculatePricing(req, res);
  }
);

export default router;
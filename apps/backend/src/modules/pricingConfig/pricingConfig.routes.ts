// File: apps/backend/src/routes/pricingConfig.routes.ts

import { Router, Request, Response } from "express";
import { pricingConfigController } from "./pricingConfig.controller";

const router = Router();

router.get("/:messageType", (req: Request, res: Response) => {
  pricingConfigController.getPricingConfigByType(req, res);
});

router.get("/", (req: Request, res: Response) => {
  pricingConfigController.getAllPricingConfigs(req, res);
});

router.get("/featured", (req: Request, res: Response) => {
  pricingConfigController.getFeaturedPricingConfigs(req, res);
});


router.post("/calculate", (req: Request, res: Response) => {
  pricingConfigController.calculatePricing(req, res);
});

export default router;
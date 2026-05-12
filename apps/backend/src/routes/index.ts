import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import guestRoutes from "@modules/guest/guest.routes";

import inviteRoutes from "@modules/invite/invite.routes";
import templateRoutes from "@modules/textmessageTemplate/text-template.routes";
import paymentRoutes from "@modules/payment/payment.router";
import events from"@modules/event/event.routes"
import imageGenerationRoutes from "@modules/image-generation/image-generation.routes";
import priceConfig from "@modules/pricingConfig/pricingConfig.routes"
const router = Router();

// ✅ mount modules
router.use("/auth", authRoutes);
router.use("/guests", guestRoutes);
router.use("/invite", inviteRoutes);
router.use("/templates",templateRoutes);
router.use("/pricing-config",priceConfig)
router.use("/payment",paymentRoutes);
router.use("/events",events)
router.use("/image-template",imageGenerationRoutes);
export default router;
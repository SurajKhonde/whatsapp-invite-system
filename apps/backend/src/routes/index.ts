import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import guestRoutes from "@modules/guest/guest.routes";

import inviteRoutes from "@modules/invite/invite.routes";
import templateRoutes from "@modules/textmessageTemplate/template.routes";
import eventRoutes from "@modules/campaign/campaign.routes";
import paymentRoutes from "@modules/payment/payment.router";
const router = Router();

// ✅ mount modules
router.use("/auth", authRoutes);
router.use("/guests", guestRoutes);
router.use("/invite", inviteRoutes);
router.use("/templates",templateRoutes);
router.use("/events",eventRoutes)
router.use("/payment",paymentRoutes)
export default router;
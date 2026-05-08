import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import guestRoutes from "@modules/guest/guest.routes";

import inviteRoutes from "@modules/invite/invite.routes";
import templateRoutes from "@modules/textmessageTemplate/template.routes";
import eventRoutes from "@modules/campaign/campaign.routes";
import paymentRoutes from "@modules/payment/payment.router";
import whatsappRutes  from "@modules/whatsapp/whatsapp.routes"
import imagegenration  from "@modules/"
const router = Router();

// ✅ mount modules
router.use("/auth", authRoutes);
router.use("/guests", guestRoutes);
router.use("/invite", inviteRoutes);
router.use("/templates",templateRoutes);
router.use("/events",eventRoutes);
router.use("/payment",paymentRoutes);
router.use("/whatsapp",whatsappRutes);
router.use("/preview_image_genration",whatsappRutes);
export default router;
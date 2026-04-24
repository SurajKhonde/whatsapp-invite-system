import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import guestRoutes from "@modules/guest/guest.routes";

import inviteRoutes from "@modules/invite/invite.routes";
import templateRoutes from "@modules/template/template.routes";

const router = Router();

// ✅ mount modules
router.use("/auth", authRoutes);
router.use("/guests", guestRoutes);
router.use("/invite", inviteRoutes);
router.use("/templates",templateRoutes);

export default router;
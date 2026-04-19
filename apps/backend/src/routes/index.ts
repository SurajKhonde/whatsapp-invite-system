import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import guestRoutes from "@modules/guest/guest.routes";

const router = Router();

// ✅ mount modules
router.use("/auth", authRoutes);
router.use("/guests", guestRoutes);

export default router;
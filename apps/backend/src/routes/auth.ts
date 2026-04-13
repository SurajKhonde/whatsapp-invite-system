import { Router } from "express";
import { signup, verify } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify", verify);

export default router;
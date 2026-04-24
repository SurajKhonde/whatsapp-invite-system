import { Router } from "express";
import { TemplateController } from "./template.controller";
import {authMiddleware} from "@middlewares/auth.middleware";
import { rateLimiter } from "@middlewares/rateLimiter";
const router = Router();
const controller = new TemplateController();

router.get("/",authMiddleware, controller.getAll);
router.post("/",authMiddleware, controller.create);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
// import { Router } from "express";
// import { TemplateController } from "./template.controller";
// import {authMiddleware} from "@middlewares/auth.middleware";
// import { rateLimiter } from "@middlewares/rateLimiter";
// const router = Router();
// const controller = new TemplateController();

// router.get("/",authMiddleware, controller.getAll);
// router.post("/", controller.create);
// router.delete("/:id", authMiddleware, controller.delete);

// export default router;

import { Router } from "express";
import { TemplateController } from "./template.controller";
import {authMiddleware} from "@middlewares/auth.middleware";

const router = Router();
const controller = new TemplateController();

// Public endpoints
router.get("/text", (req, res) => controller.getText(req, res));
router.get("/images", (req, res) => controller.getImages(req, res));
router.get("/categories", (req, res) => controller.getCategories(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));

// Protected endpoints
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;
import { Router } from "express";

import {
  imageGenerationController,
} from "./image-generation.controller";

const router = Router();

router.post(
  "/register-image-template",
  imageGenerationController.registerImageTemplate
);

export default router;
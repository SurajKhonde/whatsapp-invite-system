import { Router }
from "express";

import {
  textTemplateController,
} from "./text-template.controller";

const router = Router();

router.post(
  "/",
  textTemplateController.create
);

router.get(
  "/categories",
  textTemplateController.getCategories
);


router.get(
  "/text",
  textTemplateController.getTextTemplates
);
router.get(
  "/images",
  textTemplateController.getImageTemplates
);

router.get(
  "/",
  textTemplateController.getAll
);

router.get(
  "/category/:category",
  textTemplateController.getByCategory
);

router.get(
  "/:id",
  textTemplateController.getById
);

/**
 * Delete template
 */
router.delete(
  "/:id",
  textTemplateController.delete
);

export default router;

import {
  Request,
  Response,
} from "express";

import { db }from "@/db/index";

import { templates }
from "@/db/schema/template.schema";

import {
  templateRenderQueue,
} from "@core/queue/template-render.queue";

export class ImageGenerationController {
  async registerImageTemplate(
    req: Request,
    res: Response
  ) {
    const {
      title,
      category,
      htmlTemplateName,
      placeholders,
    } = req.body;

    const [template] =
      await db
        .insert(templates)
        .values({
          title,

          category,

          type: "image",

          htmlTemplateName,

          placeholders,

          processingStatus:
            "queued",
        })
        .returning();

    await templateRenderQueue.add(
      "render-template",{templateId:template.id,htmlTemplateName,category}
    );

    return res.status(202).json({
      success: true,
      templateId:
        template.id,
      status:
        "queued",
    });
  }
}

export const imageGenerationController =
  new ImageGenerationController();
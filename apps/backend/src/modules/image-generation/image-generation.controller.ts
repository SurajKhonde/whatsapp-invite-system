import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { templateRenderQueue } from "@core/queue/template-render.queue";
import { logger } from "@core/logger/logger";

export class ImageGenerationController {
  async registerImageTemplate(req: Request, res: Response) {
    const { title, category, htmlTemplateName, placeholders } = req.body;

    if (!title || !category || !htmlTemplateName) {
      return res.status(400).json({
        message: "title, category, and htmlTemplateName are required",
      });
    }

    // ── Check for existing entries with same title ──────────
    const existing = await db
      .select()
      .from(templates)
      .where(eq(templates.title, title));

    // Reject if a completed one exists
    const completed = existing.find(
      (t) => t.previewImageUrl && t.processingStep === "completed"
    );
    if (completed) {
      return res.status(409).json({
        message: "Template with this title already exists",
        existingId: completed.id,
      });
    }

    // Clean up any stale failed/incomplete rows with the same title
    const stale = existing.filter((t) => !t.previewImageUrl);
    if (stale.length > 0) {
      await db
        .delete(templates)
        .where(inArray(templates.id, stale.map((s) => s.id)));
      logger.info(`🧹 Cleaned ${stale.length} stale rows for "${title}"`);
    }

    // ── Fresh insert ────────────────────────────────────────
    const [template] = await db
      .insert(templates)
      .values({
        title,
        category,
        type: "image",
        htmlTemplateName,
        placeholders,
        processingStep: "queued",
      })
      .returning();

    // ── Enqueue with retry config ───────────────────────────
    await templateRenderQueue.add(
      "render-template",
      {
        templateId: template.id,
        htmlTemplateName,
        category,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return res.status(202).json({
      success: true,
      templateId: template.id,
      status: "queued",
    });
  }
}

export const imageGenerationController = new ImageGenerationController();
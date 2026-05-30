import { Worker, Job } from "bullmq";
import * as fs from "fs/promises";
import * as path from "path";
import { eq } from "drizzle-orm";

import { redisQueue } from "@config/redis";
import { logger } from "@core/logger/logger";
import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { renderHtmlToMultipleSizes } from "@utils/renderHtmlToPng";
import { RenderTemplateJob } from "@core/queue/template-render.queue";
import { cloudinaryUploadQueue } from "@core/queue/cloudinary-upload.queue";
import { templatePipelineService } from "@modules/image-generation/template-pipeline.service";

new Worker<RenderTemplateJob>(
  "templateRenderQueue",
  async (job: Job<RenderTemplateJob>) => {
    try {
      const { templateId, htmlTemplateName, category } = job.data;

      logger.info({ templateId, htmlTemplateName }, "🎨 Starting render pipeline");

      await templatePipelineService.updateState(templateId, {
        step: "rendering",
        renderingStartedAt: new Date().toISOString(),
      });

      // ── Load HTML ───────────────────────────────────────────
      logger.info({ templateId }, "📄 Loading HTML");
      const htmlPath = path.join(
        process.cwd(),
        "src/HTML-template",
        category,
        `${htmlTemplateName}.html`
      );
      const html = await fs.readFile(htmlPath, "utf8");
      logger.info({ templateId }, "✅ HTML loaded");

      // ── Render PNG ──────────────────────────────────────────
      logger.info({ templateId }, "🖼️ Rendering PNG");
      const [thumbnail, fullCard] = await renderHtmlToMultipleSizes(html, [
        { width: 400, height: 600 },
        { width: 800, height: 1200 },
      ]);
      logger.info({ templateId }, "✅ PNG rendering completed");

      // ── Save temp files ─────────────────────────────────────
      const tempDir = path.join(process.cwd(), "temp");
      await fs.mkdir(tempDir, { recursive: true });

      const thumbnailPath = path.join(tempDir, `${templateId}-thumb.png`);
      const fullCardPath = path.join(tempDir, `${templateId}-full.png`);

      await fs.writeFile(thumbnailPath, thumbnail);
      await fs.writeFile(fullCardPath, fullCard);
      logger.info({ templateId }, "✅ Temp files saved");

      // ── Checkpoint ──────────────────────────────────────────
      await templatePipelineService.updateState(templateId, {
        rendered: true,
        step: "rendered",
        thumbnailPath,
        fullCardPath,
      });

      // ── Next queue ──────────────────────────────────────────
      await cloudinaryUploadQueue.add("upload-template", {
        templateId,
        htmlTemplateName,
        thumbnailPath,
        fullCardPath,
      });

      logger.info({ templateId }, "✅ Render pipeline completed");
      return { success: true };

    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack }, "❌ Template render failed");

      if (job.data?.templateId) {
        const maxAttempts = job.opts.attempts || 1;
        const isFinalAttempt = job.attemptsMade >= maxAttempts - 1;

        if (isFinalAttempt) {
          // All retries exhausted — delete the row so it doesn't clog the DB
          await db.delete(templates).where(eq(templates.id, job.data.templateId));
          logger.warn(
            { templateId: job.data.templateId, error: error.message },
            "🗑️ Template deleted after exhausting retries"
          );
        } else {
          // Will retry — just mark state
          await templatePipelineService.updateState(job.data.templateId, {
            step: "render_failed",
            failed: true,
            error: error.message,
          });
        }
      }

      throw error;
    }
  },
  {
    connection: redisQueue,
    concurrency: 2,
  }
);

import {
  Worker,
  Job,
} from "bullmq";
import { db } from "@/db/index";
import {eq} from "drizzle-orm";
import { templates } from "@/db/schema/template.schema";
import cloudinary
from "@config/cloudinary";

import { redisQueue }
from "@config/redis";

import {
  UploadTemplateJob,
} from "@core/queue/cloudinary-upload.queue";

import {
  templateFinalizeQueue,
} from "@core/queue/template-finalize.queue";

import {
  templatePipelineService,
} from "@modules/image-generation/template-pipeline.service";

import { logger }
from "@core/logger/logger";

new Worker<UploadTemplateJob>(
  "cloudinaryUploadQueue",

  async (
    job: Job<UploadTemplateJob>
  ) => {
    try {
      const {
        templateId,

        htmlTemplateName,

        thumbnailPath,

        fullCardPath,
      } = job.data;

      logger.info(
        {
          templateId,
        },

        "☁️ Starting cloudinary upload"
      );

      // ======================================
      // UPDATE PIPELINE STATE
      // ======================================

      await templatePipelineService.updateState(
        templateId,

        {
          step:
            "uploading",
        }
      );

      // ======================================
      // UPLOAD THUMBNAIL
      // ======================================

      logger.info(
        {},
        "📤 Uploading thumbnail"
      );

      const thumbnail =
        await cloudinary.uploader.upload(
          thumbnailPath,

          {
            public_id:
              `templates/${htmlTemplateName}-thumb`,
          }
        );

      // ======================================
      // UPLOAD FULL CARD
      // ======================================

      logger.info(
        {},
        "📤 Uploading full card"
      );

      const full =
        await cloudinary.uploader.upload(
          fullCardPath,

          {
            public_id:
              `templates/${htmlTemplateName}-full`,
          }
        );

      // ======================================
      // SAVE CHECKPOINT
      // ======================================

      await templatePipelineService.updateState(
        templateId,

        {
          uploaded: true,

          thumbnailUrl:
            thumbnail.secure_url,

          fullCardUrl:
            full.secure_url,
        }
      );

      logger.info(
        {
          templateId,
        },

        "✅ Cloudinary upload completed"
      );

      // ======================================
      // FINALIZE QUEUE
      // ======================================

      await templateFinalizeQueue.add(
        "finalize-template",

        {
          templateId,

          thumbnailUrl:
            thumbnail.secure_url,

          fullCardUrl:
            full.secure_url,
        }
      );

      return {
        success: true,
      };
} catch (error: any) {
  logger.error({ error: error.message }, "❌ Cloudinary upload failed");

  if (job.data?.templateId) {
    const maxAttempts = job.opts.attempts || 1;
    const isFinalAttempt = job.attemptsMade >= maxAttempts - 1;

    if (isFinalAttempt) {
      await db.delete(templates).where(eq(templates.id, job.data.templateId));
      logger.warn(
        { templateId: job.data.templateId },
        "🗑️ Template deleted after exhausting retries"
      );
    } else {
      await templatePipelineService.updateState(job.data.templateId, {
        step: "upload_failed",
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

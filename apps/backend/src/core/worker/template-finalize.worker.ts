
import {
  Worker,
  Job,
} from "bullmq";

import { db }
from "@/db/index";

import { eq }
from "drizzle-orm";

import { templates }
from "@/db/schema/template.schema";

import { redisQueue }
from "@config/redis";

import {
  FinalizeTemplateJob,
} from "@core/queue/template-finalize.queue";

import {
  templatePipelineService,
} from "@modules/image-generation/template-pipeline.service";

import { logger }
from "@core/logger/logger";

new Worker<FinalizeTemplateJob>(
  "templateFinalizeQueue",

  async (
    job: Job<FinalizeTemplateJob>
  ) => {
    try {
      const {
        templateId,

        thumbnailUrl,

        fullCardUrl,
      } = job.data;

      logger.info(
        {
          templateId,
        },

        "🗂️ Finalizing template"
      );

      // ======================================
      // UPDATE PIPELINE STATE
      // ======================================

      await templatePipelineService.updateState(
        templateId,

        {
          step:
            "finalizing",
        }
      );

      // ======================================
      // UPDATE DATABASE
      // ======================================

      await db
        .update(templates)
        .set({
          previewImageUrl:
            thumbnailUrl,

          previewImageUrlFull:
            fullCardUrl,

          processingStatus:
            "completed",

          processingStep:
            "completed",

          hasImage: true,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            templates.id,
            templateId
          )
        );

      // ======================================
      // COMPLETE CHECKPOINT
      // ======================================

      await templatePipelineService.updateState(
        templateId,

        {
          completed: true,

          step:
            "completed",
        }
      );

      logger.info(
        {
          templateId,
        },

        "✅ Template finalized"
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

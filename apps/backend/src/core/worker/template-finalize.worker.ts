// ============================================================
// FILE:
// src/core/worker/template-finalize.worker.ts
// ============================================================

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
      logger.error(
        {
          error:
            error.message,
        },

        "❌ Template finalize failed"
      );

      throw error;
    }
  },

  {
    connection: redisQueue,

    concurrency: 2,
  }
);

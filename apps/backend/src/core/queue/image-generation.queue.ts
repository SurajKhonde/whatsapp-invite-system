// ============================================
// FILE:
// src/core/queue/image-generation.queue.ts
// ============================================

import { Queue } from "bullmq";

import { redisQueue }
from "@config/redis";

export interface TemplatePreviewJob {
  jobType: "template-preview";

  templateId: string;

  htmlTemplateName: string;

  category: string;
}

export const imageGenerationQueue =
  new Queue<TemplatePreviewJob>(
    "imageGenerationQueue",
    {
      connection: redisQueue,

      defaultJobOptions: {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 2000,
        },

        removeOnComplete: {
          age: 3600,
        },

        removeOnFail: false,
      },
    }
  );
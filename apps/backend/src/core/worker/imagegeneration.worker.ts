
import {
  Worker,
  Job,
} from "bullmq";

import { redisQueue }
from "@config/redis";

import {
  imageGenerationService,
} from "@modules/image-generation/image-generation.service";

import {
  TemplatePreviewJob,
} from "@core/queue/image-generation.queue";

import { logger }
from "@core/logger/logger";

new Worker<TemplatePreviewJob>(
  "imageGenerationQueue",

  async (
    job: Job<TemplatePreviewJob>
  ) => {
    try {
      logger.info(
        job.data,
        "🎨 Processing image generation"
      );

      const result =
        await imageGenerationService.generatePreviewImages(
          job.data
        );

      logger.info(
        result,
        "✅ Image generation completed"
      );

      return result;
    } catch (error) {
      logger.error(
        { error },
        "❌ Worker image generation failed"
      );

      throw error;
    }
  },

  {
    connection: redisQueue,

    concurrency: 2,
  }
);

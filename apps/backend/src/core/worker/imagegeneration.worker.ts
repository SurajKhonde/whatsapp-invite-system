import { Worker, Job } from "bullmq";
import { redisQueue } from "@config/redis";
import {ImageGenerationJob } from "@queue/image-generation.queue";
import { imageGenerationService } from "@modules/image-generation/image-generation.service";
import { logger } from "@core/logger/logger";

/**
 * Worker for image generation jobs
 * Runs in background and generates images from templates
 */
new Worker<ImageGenerationJob>(
  "imageGeneration",
  async (job: Job<ImageGenerationJob>) => {
    logger.info(
      { jobId: job.id, eventType: job.data.eventType },
      "Processing image generation job"
    );

    try {
      // Call the mock/real image generation service
      const result = await imageGenerationService.mockGenerateImage(job.data);

      logger.info(
        { jobId: job.id, fileName: result.fileName },
        "Image generation completed"
      );

      // Return the result (will be stored in job.returnvalue)
      return {
        success: true,
        imageUrl: result.imageUrl,
        fileName: result.fileName,
      };
    } catch (error: any) {
      logger.error(
        { jobId: job.id, error: error.message },
        "Image generation failed"
      );

      // Throw error to fail the job
      throw error;
    }
  },
  {
    connection: redisQueue,
    concurrency: 2, // Generate 2 images in parallel
  }
);
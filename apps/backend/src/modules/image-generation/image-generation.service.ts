import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";
import { imageGenerationQueue, ImageGenerationJob } from "@queue/image-generation.queue";

export class ImageGenerationService {
  /**
   * Queue an image generation job
   * Returns jobId immediately (non-blocking)
   */
  async generateImage(payload: ImageGenerationJob) {
    try {
      const job = await imageGenerationQueue.add(
        "generate",
        payload,
        {
          jobId: `img-${payload.userId}-${Date.now()}`,
        }
      );

      logger.info(
        {
          jobId: job.id,
          eventType: payload.eventType,
          userId: payload.userId,
        },
        "Image generation job queued"
      );

      return {
        jobId: job.id,
        status: "processing",
      };
    } catch (error) {
      logger.error(
        { userId: payload.userId, error },
        "Error queuing image generation"
      );
      throw new AppError("Failed to queue image generation", 500);
    }
  }

  /**
   * Get image generation job status
   */
  async getJobStatus(jobId: string) {
    try {
      const job = await imageGenerationQueue.getJob(jobId);

      if (!job) {
        throw new AppError("Job not found", 404);
      }

      const state = await job.getState();
      const progress = job.progress;
      const data = job.data;

      let status = "processing";
      let imageUrl = null;
      let error = null;

      if (state === "completed") {
        status = "completed";
        // Job result is in job.returnvalue
        imageUrl = job.returnvalue?.imageUrl || null;
      } else if (state === "failed") {
        status = "failed";
        error = job.failedReason || "Image generation failed";
      }

      logger.info(
        { jobId, status, progress },
        "Fetched job status"
      );

      return {
        jobId,
        status,
        progress,
        imageUrl,
        error,
        data,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ jobId, error }, "Error fetching job status");
      throw new AppError("Failed to fetch job status", 500);
    }
  }

  /**
   * Mock image generation (for now)
   * In real implementation, this would use Puppeteer/Playwright to render HTML to image
   * or use an image processing library
   */
  async mockGenerateImage(
    payload: ImageGenerationJob
  ): Promise<{
    imageUrl: string;
    fileName: string;
  }> {
    // In production, you would:
    // 1. Load HTML template based on eventType
    // 2. Replace placeholders with actual data
    // 3. Use Puppeteer to render to image
    // 4. Upload to Cloudinary
    // 5. Return the URL

    try {
      // For now, simulate image generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock URL (replace with real Cloudinary upload)
      const fileName = `event-${payload.userId}-${Date.now()}.png`;
      const imageUrl = `https://cloudinary.com/placeholder/${fileName}`;

      logger.info(
        { fileName, eventType: payload.eventType },
        "Mock image generated"
      );

      return {
        imageUrl,
        fileName,
      };
    } catch (error) {
      logger.error({ error }, "Error in mock image generation");
      throw error;
    }
  }
}

export const imageGenerationService = new ImageGenerationService();
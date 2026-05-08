import { Queue } from "bullmq";
import { redisQueue } from "@config/redis";

export interface ImageGenerationJob {
  userId: string;
  eventType: string;
  groomName?: string;
  brideName?: string;
  celebrantName?: string;
  eventName?: string;
  eventDate: string;
  eventTime?: string;
  venueName: string;
  venueAddress?: string;
  schoolName?: string;
  location?: string;
}

export const imageGenerationQueue = new Queue<ImageGenerationJob>(
  "imageGeneration",
  {
    connection: redisQueue,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: {
        age: 3600,
      },
    },
  }
);
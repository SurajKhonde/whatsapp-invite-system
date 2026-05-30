import { Queue } from "bullmq";
import { redisQueue } from "@config/redis";

export interface RenderTemplateJob {
  templateId: string;
  htmlTemplateName: string;
  category: string;
}

export const templateRenderQueue = new Queue<RenderTemplateJob>(
  "templateRenderQueue",
  {
    connection: redisQueue,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  }
);
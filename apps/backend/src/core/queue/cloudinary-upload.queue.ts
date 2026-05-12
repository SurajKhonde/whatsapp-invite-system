
import { Queue } from "bullmq";

import { redisQueue }
from "@config/redis";

export interface UploadTemplateJob {
  templateId: string;

  htmlTemplateName: string;

  thumbnailPath: string;

  fullCardPath: string;
}

export const cloudinaryUploadQueue =
  new Queue<UploadTemplateJob>(
    "cloudinaryUploadQueue",

    {
      connection: redisQueue,
    }
  );
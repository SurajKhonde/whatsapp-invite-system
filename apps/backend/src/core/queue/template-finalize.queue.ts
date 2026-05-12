// ============================================================
// FILE:
// src/core/queue/template-finalize.queue.ts
// ============================================================

import { Queue } from "bullmq";

import { redisQueue }
from "@config/redis";

export interface FinalizeTemplateJob {
  templateId: string;

  thumbnailUrl: string;

  fullCardUrl: string;
}

export const templateFinalizeQueue =
  new Queue<FinalizeTemplateJob>(
    "templateFinalizeQueue",

    {
      connection: redisQueue,
    }
  );
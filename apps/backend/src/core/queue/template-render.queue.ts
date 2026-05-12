// ============================================================
// ARCHITECTURE
// ============================================================

/**
 * PIPELINE:
 *
 * API
 * ↓
 * templateRenderQueue
 * ↓
 * cloudinaryUploadQueue
 * ↓
 * templateFinalizeQueue
 *
 * Redis stores checkpoint state
 */

// ============================================================
// FILE:
// src/core/queue/template-render.queue.ts
// ============================================================

import { Queue } from "bullmq";

import { redisQueue }
from "@config/redis";

export interface RenderTemplateJob {
  templateId: string;

  htmlTemplateName: string;

  category: string;
}

export const templateRenderQueue =
  new Queue<RenderTemplateJob>(
    "templateRenderQueue",

    {
      connection: redisQueue,
    }
  );
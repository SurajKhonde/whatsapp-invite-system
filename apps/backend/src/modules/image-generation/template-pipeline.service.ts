// ============================================================
// FILE:
// src/modules/image-generation/template-pipeline.service.ts
// ============================================================

import Redis from "ioredis";

const redis = new Redis();

export class TemplatePipelineService {
  async updateState(
    templateId: string,

    data: Record<string, any>
  ) {
    const key =
      `template:${templateId}`;

    const existing =
      await redis.get(key);

    const parsed =
      existing
        ? JSON.parse(existing)
        : {};

    const updated = {
      ...parsed,
      ...data,
      updatedAt:
        new Date().toISOString(),
    };

    await redis.set(
      key,
      JSON.stringify(updated)
    );

    return updated;
  }

  async getState(
    templateId: string
  ) {
    const key =
      `template:${templateId}`;

    const state =
      await redis.get(key);

    return state
      ? JSON.parse(state)
      : null;
  }
}

export const templatePipelineService =
  new TemplatePipelineService();
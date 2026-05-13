
import Redis from "ioredis";
import { redisCache } from "@config/redis";
export class TemplatePipelineService {
  async updateState(
    templateId: string,

    data: Record<string, any>
  ) {
    const key =
      `template:${templateId}`;

    const existing =
      await redisCache.get(key);

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

    await redisCache.set(
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
      await redisCache.get(key);

    return state
      ? JSON.parse(state)
      : null;
  }
}

export const templatePipelineService =
  new TemplatePipelineService();
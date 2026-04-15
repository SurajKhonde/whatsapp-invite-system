import { redisCache } from "../../config/redis";

const TTL = 60 * 5; // 5 minutes

export const getTemplateCache = async (key: string) => {
  const data = await redisCache.get(key);
  return data ? JSON.parse(data) : null;
};

export const setTemplateCache = async (key: string, value: any) => {
  await redisCache.set(key, JSON.stringify(value), "EX", TTL);
};
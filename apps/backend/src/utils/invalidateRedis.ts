import { redisCache } from "@config/redis";
export const invalidateUserCache = async (userId: string): Promise<void> => {
  try {
    const cacheKey = `user:verified:${userId}`;
    await redisCache.del(cacheKey);
    console.log(`✅ Cache invalidated for user: ${userId}`);
  } catch (err) {
    console.error(`❌ Error invalidating cache for user ${userId}:`, err);
  }
};
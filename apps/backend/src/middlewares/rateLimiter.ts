import { Request, Response, NextFunction } from "express";
import { redisCache } from "@config/redis";
import { AppError } from "@core/errors/AppError";

export const rateLimiter = ({
  limit,
  windowSec,
  keyPrefix,
}: {
  limit: number;
  windowSec: number;
  keyPrefix: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || req.ip;

      const key = `${keyPrefix}:${userId}`;

      const count = await redisCache.incr(key);

      if (count === 1) {
        await redisCache.expire(key, windowSec);
      }

      if (count > limit) {
        throw new AppError("Too many requests. Try later.", 429);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
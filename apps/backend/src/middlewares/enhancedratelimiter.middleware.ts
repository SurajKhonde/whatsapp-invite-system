import { Request, Response, NextFunction } from "express";
import { redisCache } from "@config/redis";
import { AppError } from "@core/errors/AppError";


export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints
  AUTH: {
    login: { limit: 5, windowSec: 900 }, // 5 requests per 15 minutes
    signup: { limit: 3, windowSec: 3600 }, // 3 requests per hour
    verifyOtp: { limit: 20, windowSec: 600 }, // 10 requests per 10 minutes
    forgotPassword: { limit: 3, windowSec: 600 }, // 3 requests per 10 minutes
    resetPassword: { limit: 5, windowSec: 1800 }, // 5 requests per 30 minutes
  },

  PAYMENT: {
    createOrder: { limit: 10, windowSec: 3600 }, // 10 requests per hour
    verifyPayment: { limit: 15, windowSec: 3600 }, // 15 requests per hour
    getPayments: { limit: 30, windowSec: 3600 }, // 30 requests per hour
  },

  // Event endpoints
  EVENT: {
    create: { limit: 20, windowSec: 3600 }, // 20 requests per hour
    update: { limit: 30, windowSec: 3600 }, // 30 requests per hour
    list: { limit: 100, windowSec: 3600 }, // 100 requests per hour
    delete: { limit: 10, windowSec: 3600 }, // 10 requests per hour
    addGuest: { limit: 70, windowSec: 3600 }, // 50 requests per hour
  },

  // General API endpoints
  GENERAL: {
    default: { limit: 100, windowSec: 3600 }, // 100 requests per hour
    imageUpload: { limit: 30, windowSec: 3600 }, // 30 requests per hour
    templateRendering: { limit: 40, windowSec: 3600 },// 40 requests per hour
    inviteSender:{ limit: 10, windowSec: 3600 }, 
  },
};

/**
 * Enhanced Rate Limiter Middleware
 * 
 * Features:
 * - Different limits per endpoint type
 * - User-based limiting (authenticated users)
 * - IP-based limiting (anonymous users)
 * - Detailed error messages with retry-after info
 * - Redis-backed for distributed rate limiting
 * 
 * Usage:
 * app.post('/login', rateLimiter('AUTH', 'login'), loginHandler)
 * app.post('/payment/create', rateLimiter('PAYMENT', 'createOrder'), paymentHandler)
 * app.post('/event/create', rateLimiter('EVENT', 'create'), eventHandler)
 */
export const rateLimiter = (
  category: keyof typeof RATE_LIMIT_CONFIG,
  endpoint: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get configuration for this endpoint
      const config =
        (RATE_LIMIT_CONFIG[category] as any)?.[endpoint] ||
        RATE_LIMIT_CONFIG.GENERAL.default;

      // Use user ID if authenticated, otherwise use IP address
      const identifier = (req as any).user?.userId || req.ip || "unknown";
      const isAuthenticated = !!(req as any).user?.userId;

      // Create unique key for rate limiting
      const key = `ratelimit:${category}:${endpoint}:${identifier}`;

      // Increment request counter
      const count = await redisCache.incr(key);

      // Set expiration on first request
      if (count === 1) {
        await redisCache.expire(key, config.windowSec);
      }

      // Get remaining time for this rate limit window
      const ttl = await redisCache.ttl(key);
      const remainingTime = ttl > 0 ? ttl : config.windowSec;
      const remainingRequests = Math.max(0, config.limit - count);

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", config.limit);
      res.setHeader("X-RateLimit-Remaining", remainingRequests);
      res.setHeader("X-RateLimit-Reset", new Date(Date.now() + remainingTime * 1000).toISOString());
      res.setHeader("Retry-After", remainingTime);

      // Check if limit exceeded
      if (count > config.limit) {
        const error = new AppError(
          `Too many ${endpoint} requests. Please try again in ${remainingTime} seconds.`,
          429
        );

        // Add retry-after header
        res.setHeader("Retry-After", remainingTime);

        throw error;
      }

      // Log rate limit info for monitoring
      if (count > config.limit * 0.8) {
        console.warn(
          `⚠️  Rate limit warning: ${identifier} on ${category}/${endpoint} - ${count}/${config.limit} requests`
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Lenient Rate Limiter for less critical endpoints
 * Higher limits, longer windows
 */
export const lenientRateLimiter = (
  windowSec: number = 3600,
  limit: number = 1000
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = (req as any).user?.userId || req.ip || "unknown";
      const key = `ratelimit:lenient:${identifier}`;

      const count = await redisCache.incr(key);

      if (count === 1) {
        await redisCache.expire(key, windowSec);
      }

      const ttl = await redisCache.ttl(key);
      const remainingTime = ttl > 0 ? ttl : windowSec;
      const remainingRequests = Math.max(0, limit - count);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remainingRequests);
      res.setHeader("X-RateLimit-Reset", new Date(Date.now() + remainingTime * 1000).toISOString());

      if (count > limit) {
        throw new AppError(
          `Rate limit exceeded. Please try again in ${remainingTime} seconds.`,
          429
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Strict Rate Limiter for sensitive operations
 * Lower limits, shorter windows
 */
export const strictRateLimiter = (
  windowSec: number = 300,
  limit: number = 5
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = (req as any).user?.userId || req.ip || "unknown";
      const key = `ratelimit:strict:${identifier}`;

      const count = await redisCache.incr(key);

      if (count === 1) {
        await redisCache.expire(key, windowSec);
      }

      const ttl = await redisCache.ttl(key);
      const remainingTime = ttl > 0 ? ttl : windowSec;
      const remainingRequests = Math.max(0, limit - count);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remainingRequests);
      res.setHeader("X-RateLimit-Reset", new Date(Date.now() + remainingTime * 1000).toISOString());
      res.setHeader("Retry-After", remainingTime);

      if (count > limit) {
        throw new AppError(
          `Too many requests. Please try again in ${remainingTime} seconds.`,
          429
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Clear rate limit for a user (admin use)
 * 
 * Usage: await clearRateLimit(userId, 'AUTH', 'login')
 */
export const clearRateLimit = async (
  identifier: string,
  category: string,
  endpoint: string
): Promise<void> => {
  const key = `ratelimit:${category}:${endpoint}:${identifier}`;
  await redisCache.del(key);
};

/**
 * Get current rate limit status for a user
 */
export const getRateLimitStatus = async (
  identifier: string,
  category: keyof typeof RATE_LIMIT_CONFIG,
  endpoint: string
): Promise<{
  current: number;
  limit: number;
  remaining: number;
  resetIn: number;
  isLimited: boolean;
}> => {
  const config =
    (RATE_LIMIT_CONFIG[category] as any)?.[endpoint] ||
    RATE_LIMIT_CONFIG.GENERAL.default;

  const key = `ratelimit:${category}:${endpoint}:${identifier}`;
  const current = parseInt((await redisCache.get(key)) || "0", 10);
  const ttl = await redisCache.ttl(key);
  const resetIn = ttl > 0 ? ttl : config.windowSec;

  return {
    current,
    limit: config.limit,
    remaining: Math.max(0, config.limit - current),
    resetIn,
    isLimited: current > config.limit,
  };
};
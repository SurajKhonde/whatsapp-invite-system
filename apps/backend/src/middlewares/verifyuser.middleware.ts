import { Request, Response, NextFunction } from "express";
import { db } from "@/db/index";
import { users } from "@/db/schema/user.schema";
import { eq } from "drizzle-orm";
import { AppError } from "@core/errors/AppError";
import { redisCache } from "@config/redis";

export const verifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log("asdsdasdasdafsfsfsf")
  try {
    const userId = (req as any).user?.userId;
 console.log(userId,"asdsdasdasdafsfsfsf001")
    if (!userId) {
      throw new AppError("User ID not found in token", 401);
    }
 
    // ✅ Try to get cached verification status (1 hour TTL)
    const cacheKey = `user:verified:${userId}`;
    const cachedStatus = await redisCache.get(cacheKey);
 
    if (cachedStatus) {
      // ✅ User is in cache, check status
      const status = JSON.parse(cachedStatus);
 console.log(status,"asdsdasdasdafsfsfsf002")
      if (!status.isActive) {
        throw new AppError("Account is deactivated.", 403);
      }
 
      if (!status.isVerified) {
        throw new AppError(
          "Email not verified. Please verify your email first.",
          403
        );
      }
 
      // ✅ Attach complete user info to request
      (req as any).user = {
        ...((req as any).user || {}),
        ...status,
      };
 
      return next();
    }
 
    // ✅ Not in cache, query database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
        profileImageUrl: users.profileImageUrl,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
 
    if (!user || user.length === 0) {
      throw new AppError("User not found", 404);
    }
 
    const userData = user[0];
 
    console.log(userData, "--->0125 (verifyUserMiddleware)");
 
    // ✅ Check if account is active FIRST
    if (!userData.isActive) {
      throw new AppError("Account is deactivated.", 403);
    }
 
    // ✅ Check if email is verified SECOND
    if (!userData.isEmailVerified) {
      throw new AppError(
        "Email not verified. Please verify your email first.",
        403
      );
    }
 
    // ✅ All checks passed, cache the user status
    const verificationStatus = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isEmailVerified,
      isActive: userData.isActive,
      profileImageUrl: userData.profileImageUrl,
    };
 
    // ✅ Cache for 1 hour (3600 seconds)
    await redisCache.setex(
      cacheKey,
      3600,
      JSON.stringify(verificationStatus)
    );
 
    // ✅ Attach complete user info to request
    (req as any).user = {
      ...((req as any).user || {}),
      ...verificationStatus,
    };
 
    next();
  } catch (err) {
    // ✅ Pass error to Express error handler
    next(err);
  }
};
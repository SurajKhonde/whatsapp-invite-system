import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@core/errors/AppError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new AppError("Unauthorized: No token", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // ✅ attach user
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (err) {
    return next(new AppError("Unauthorized: Invalid or expired token", 401));
  }
};
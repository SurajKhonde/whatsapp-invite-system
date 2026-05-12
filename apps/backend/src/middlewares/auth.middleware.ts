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
      return next(new AppError("Unauthorized: No token", 401));
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
 
    // ✅ Attach user info to request
    (req as any).user = {
      userId: decoded.userId,
      role: decoded.role,
    };
 
    next();
  } catch (err) {
    return next(new AppError("Unauthorized: Invalid or expired token", 401));
  }
};
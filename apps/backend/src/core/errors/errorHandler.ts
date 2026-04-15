import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logger/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({ err }, "Unhandled error");

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
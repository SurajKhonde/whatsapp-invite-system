import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logger/logger";
import { AppError } from "@core/errors/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ Known / expected errors
  if (err instanceof AppError) {
    logger.warn(
      {
        message: err.message,
        statusCode: err.statusCode,
        path: req.originalUrl,
        method: req.method,
      },
      "Handled application error"
    );

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  logger.error(
    {
      err,
      path: req.originalUrl,
      method: req.method,
    },
    "Unhandled system error"
  );

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
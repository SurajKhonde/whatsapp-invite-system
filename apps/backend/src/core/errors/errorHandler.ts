import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logger/logger";
import { AppError } from "@core/errors/AppError";
const errorId = Date.now();
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      notify: err.notify ?? true,
    });
  }

  
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry",
      notify: true,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
      notify: true,
    });
  }

  // ❌ Unknown / system errors
  logger.error(
    {
       errorId,
      err,
      path: req.originalUrl,
      method: req.method,
    },
    "Unhandled system error"
  );

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    notify: false, 
    errorId
  });
};
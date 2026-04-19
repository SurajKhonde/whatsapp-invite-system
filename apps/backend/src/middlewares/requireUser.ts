import { Request } from "express";
import { AppError } from "@core/errors/AppError";

export const requireUser = (req: Request) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  return req.user;
};
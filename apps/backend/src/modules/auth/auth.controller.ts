import { Request, Response } from "express";
import { signupService } from "./auth.service";
import { asyncHandler } from "@core/middleware/asyncHandler";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await signupService({ email, password });

  res.status(201).json({
    success: true,
    ...result,
  });
});
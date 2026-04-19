import { Request, Response, NextFunction } from "express";
import { AppError } from "@core/errors/AppError";

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, password, name } = req.body;

  // ✅ Normalize
  email = email?.trim().toLowerCase();
  password = password?.trim();
  name = name?.trim();

  // ✅ Required
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Invalid email format", 400));
  }

  // ✅ Password validation
  const passwordRegex = /^(?=.*[A-Za-z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new AppError(
        "Password must be at least 8 characters and contain at least one letter",
        400
      )
    );
  }

  // ✅ Name validation (optional)
  if (name && !/^[A-Za-z\s]+$/.test(name)) {
    return next(
      new AppError("Name should not contain numbers or special characters", 400)
    );
  }

  // ✅ Attach sanitized values
  req.body.email = email;
  req.body.password = password;
  req.body.name = name;

  next();
};
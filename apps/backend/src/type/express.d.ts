import "express";

export {}; // 👈 VERY IMPORTANT

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
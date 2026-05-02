import { Response } from "express";

type ApiResponse<T = any> = {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  notify?: boolean;
};

export const sendResponse = <T = any>({
  res,
  statusCode = 200,
  message = "Success",
  data,
  notify = true,
}: ApiResponse<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    notify,
  });
};
import { Request, Response, NextFunction } from "express";
import { InviteService } from "./invite.service";
import { sendResponse } from "@utils/response";

const inviteService = new InviteService();

export const createInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await inviteService.generateAndSave(req.body);

    return sendResponse({
      res,
      statusCode: 201,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
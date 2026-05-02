import { Request, Response, NextFunction } from "express";
import {
  addGuestsService,
  getGuestsService,
  revealGuestsService,
} from "./guest.service";
import { requireUser } from "@middlewares/requireUser";
import { sendResponse } from "@utils/response";

// POST /api/guests/bulk
export const addGuests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const hostId = user.userId;
    const { guests } = req.body;

    const result = await addGuestsService(hostId, guests);

    return sendResponse({
      res,
      statusCode: 201,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/guests
export const getGuests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const hostId = user.userId;

    const result = await getGuestsService(hostId);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/guests/reveal
export const revealController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const hostId = user.userId;

    const { guestIds } = req.body;

    const result = await revealGuestsService(hostId, guestIds);

    return sendResponse({
      res,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
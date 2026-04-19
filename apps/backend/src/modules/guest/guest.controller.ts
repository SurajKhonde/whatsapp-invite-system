import { Request, Response } from "express";
import {
  addGuestsService,
  getGuestsService,
  revealGuestsService
} from "./guest.service";
import { requireUser } from "@middlewares/requireUser";

//  POST /api/guests/bulk
export const addGuests = async (req: Request, res: Response) => {
  const user =requireUser(req);
  const hostId = user.userId;
  const { guests } = req.body;

  const data = await addGuestsService(hostId, guests);

  res.json({
    success: true,
    data,
  });
};

// GET /api/guests
export const getGuests = async (req: Request, res: Response) => {
  const user =requireUser(req);
  const hostId = user.userId;
  

  const guests = await getGuestsService(hostId);

 res.json({
    success: true,
    data: guests,
  });
};
export const revealController = (async (req: Request, res: Response) => {
  const user = requireUser(req);
  const hostId = user.userId;

  const { guestIds } = req.body;

  const data = await revealGuestsService(hostId, guestIds);

  res.status(200).json({
    success: true,
    data,
  });
});
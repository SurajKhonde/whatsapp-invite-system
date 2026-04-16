import { Request, Response } from "express";
import {
  addGuestsService,
  getGuestsService,
} from "./guest.service";

// 🔥 POST /api/guests/bulk
export const addGuests = async (req: Request, res: Response) => {
  const hostId = req.user?.id;
  const { guests } = req.body;

  const data = await addGuestsService(hostId, guests);

  res.json({
    success: true,
    data,
  });
};

// 🔥 GET /api/guests
export const getGuests = async (req: Request, res: Response) => {
  const hostId = req.user?.id;

  const guests = await getGuestsService(hostId);

  res.json({
    success: true,
    data: guests,
  });
};
import { bulkInsertGuests, getGuestsByHost } from "./guest.repo";
import { AppError } from "@core/errors/AppError";

export const addGuestsService = async (hostId: string, guests: any[]) => {
  if (!guests || guests.length === 0) {
    throw new AppError("Guests required", 400);
  }

  return await bulkInsertGuests(hostId, guests);
};

export const getGuestsService = async (hostId: string) => {
  return await getGuestsByHost(hostId);
};
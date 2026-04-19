import { bulkInsertGuests, getGuestsByHost, revealGuestPhones } from "./guest.repo";
import { AppError } from "@core/errors/AppError";

export const addGuestsService = async (hostId: string, guests: any[]) => {
  if (!guests || guests.length === 0) {
    throw new AppError("Guests required", 400);
  }

  return bulkInsertGuests(hostId, guests);
};

export const getGuestsService = async (hostId: string) => {
  if (!hostId) {
    throw new AppError("Unauthorized", 401);
  }

  return getGuestsByHost(hostId);
};
export const revealGuestsService = async (
  hostId: string,
  guestIds: string[]
) => {
  if (!hostId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!guestIds || !Array.isArray(guestIds) || guestIds.length === 0) {
    throw new AppError("guestIds required", 400);
  }

  // if (guestIds.length > 20) {
  //   throw new AppError("Too many guests requested", 400);
  // }

  return revealGuestPhones(hostId, guestIds);
};
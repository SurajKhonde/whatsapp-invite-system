import { bulkInsertGuests, getGuestsByHost, revealGuestPhones } from "./guest.repo";
import { AppError } from "@core/errors/AppError";

export const addGuestsService = async (hostId: string, guests: any[]) => {
  if (!guests || guests.length === 0) {
    throw new AppError("Guests required", 400);
  }

  const data = await bulkInsertGuests(hostId, guests);

  return {
    message: "Guests added successfully",
    data,
    notify: true,
  };
};

export const getGuestsService = async (hostId: string) => {
  if (!hostId) {
    throw new AppError("Unauthorized", 401);
  }

  const data = await getGuestsByHost(hostId);

  return {
    message: "Guests fetched",
    data,
    notify: false, // 🔥 no toast
  };
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

  const data = await revealGuestPhones(hostId, guestIds);

  return {
    message: "Guests revealed successfully",
    data,
    notify: true,
  };
};
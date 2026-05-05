// apps/backend/src/modules/guest/guest.service.ts

import {
  bulkInsertGuests,
  getGuestsByHost,
  revealGuestPhones,
  GuestInput,
} from "./guest.repo";
import { AppError } from "@core/errors/AppError";

export const addGuestsService = async (
  hostId: string,
  guests: GuestInput[]
) => {
  if (!Array.isArray(guests) || guests.length === 0) {
    throw new AppError("Guests required", 400);
  }

  // Validate each guest has required fields
  for (const g of guests) {
    if (!g.name?.trim())  throw new AppError("Each guest must have a name", 400);
    if (!g.phone?.trim()) throw new AppError("Each guest must have a phone number", 400);
  }

  const data = await bulkInsertGuests(hostId, guests);

  return {
    message: `${data.length} guest(s) added successfully`,
    data,
    notify: true,
  };
};

export const getGuestsService = async (hostId: string) => {
  if (!hostId) throw new AppError("Unauthorized", 401);

  const data = await getGuestsByHost(hostId);

  return {
    message: "Guests fetched",
    data,
    notify: false,
  };
};

export const revealGuestsService = async (
  hostId:   string,
  guestIds: string[]
) => {
  if (!hostId) throw new AppError("Unauthorized", 401);

  if (!Array.isArray(guestIds) || guestIds.length === 0) {
    throw new AppError("guestIds required", 400);
  }

  const data = await revealGuestPhones(hostId, guestIds);

  return {
    message: "Guests revealed successfully",
    data,
    notify: true,
  };
};
import { Request, Response, NextFunction } from "express";
import { campaignService } from "./campaign.service";
import { sendResponse } from "@utils/response";
import { AppError } from "@core/errors/AppError";

export class CampaignController {
  // ✅ START CAMPAIGN (Send WhatsApp invites)
  start = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const { eventId } = req.body;
      if (!eventId || typeof eventId !== "string") {
        throw new AppError("Event ID is required", 400);
      }

      const result = await campaignService.startCampaign({
        userId,
        eventId,
      });

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET CAMPAIGN STATUS
  getStatus = async (
    req: Request<{ eventId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const eventId: string = req.params.eventId;

      if (!eventId) {
        throw new AppError("Event ID is required", 400);
      }

      const result = await campaignService.getCampaignStatus(userId, eventId);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET ALL EVENTS
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const result = await campaignService.getEvents(userId);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET EVENT DETAILS (NEW)
  getDetails = async (
    req: Request<{ eventId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const eventId: string = req.params.eventId;

      if (!eventId) {
        throw new AppError("Event ID is required", 400);
      }

      const result = await campaignService.getEventDetails(userId, eventId);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ CANCEL CAMPAIGN
  cancel = async (
    req: Request<{ eventId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const eventId: string = req.params.eventId;

      if (!eventId) {
        throw new AppError("Event ID is required", 400);
      }

      const result = await campaignService.cancelCampaign(userId, eventId);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ RETRY FAILED GUESTS (NEW)
  retryFailed = async (
    req: Request<{ eventId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const eventId: string = req.params.eventId;

      if (!eventId) {
        throw new AppError("Event ID is required", 400);
      }

      const result = await campaignService.retryFailedGuests(userId, eventId);

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const campaignController = new CampaignController();
import { Request, Response, NextFunction } from "express";
import { EventService } from "./campaign.service";
import { sendResponse } from "@utils/response";
import { AppError } from "@core/errors/AppError";

export class EventController {
  private service = new EventService();

  // ✅ CREATE EVENT
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const result = await this.service.createEvent(userId, req.body);

      return sendResponse({
        res,
        statusCode: 201,
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

      const result = await this.service.getEvents(userId);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET EVENT DETAILS
  getOne = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const { id } = req.params;

      const result = await this.service.getEventDetails(userId, id);

      return sendResponse({
        res,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };
}
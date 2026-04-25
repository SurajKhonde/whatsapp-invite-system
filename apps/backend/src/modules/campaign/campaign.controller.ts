import { Request, Response, NextFunction } from "express";
import { EventService } from "./campaign.service";

export class EventController {
  private service = new EventService();

  // ✅ CREATE (you already have)
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false });
      }

      const event = await this.service.createEvent(userId, req.body);

      return res.status(201).json({
        success: true,
        data: event,
      });
    } catch (err) {
      return next(err);
    }
  };

  // ✅ GET ALL EVENTS
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false });
      }

      const events = await this.service.getEvents(userId);

      return res.json({
        success: true,
        data: events,
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
      return res.status(401).json({ success: false });
    }

    const { id } = req.params;

    const data = await this.service.getEventDetails(userId, id);

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
}
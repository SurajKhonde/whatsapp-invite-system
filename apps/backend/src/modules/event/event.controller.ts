// src/modules/event/event.controller.ts

import {
  Request,
  Response,
  NextFunction,
} from "express";

import { eventService }
from "./event.service";

import { sendResponse }
from "@utils/response";

import { AppError }
from "@core/errors/AppError";

import { logger }
from "@core/logger/logger";

/**
 * ============================================
 * GET USER ID
 * ============================================
 */

const getUserId = (
  req: Request
) => {
  const userId =
    req.user?.userId;

  if (!userId) {
    throw new AppError(
      "Unauthorized",
      401
    );
  }

  return userId;
};

/**
 * ============================================
 * CREATE EVENT
 * ============================================
 */

export const createEvent =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await eventService.createEvent({
          userId:
            getUserId(req),

          ...req.body,
        });

      return sendResponse({
        res,
        statusCode: 201,
        ...result,
        notify: true,
      });
    } catch (error) {
      logger.error(
        { error },
        "Create event failed"
      );

      next(error);
    }
  };

/**
 * ============================================
 * GET EVENTS
 * ============================================
 */

export const getEvents =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await eventService.getEvents(
          getUserId(req)
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * ============================================
 * GET EVENT BY ID
 * ============================================
 */

export const getEventById =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const idParam =
        req.params.id;
        const id =
        Array.isArray(idParam)
          ? idParam[0]
          : idParam;

      const result =
        await eventService.getEventById(
          getUserId(req),
          id
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * ============================================
 * GET EVENT STATUS
 * ============================================
 */

export const getEventStatus =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const idevent =
        req.params.eventId;
        const id =
        Array.isArray(idevent)
          ? idevent[0]
          : idevent;

      const result =
        await eventService.getEventStatus(
          getUserId(req),
          id
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * ============================================
 * UPDATE EVENT
 * ============================================
 */

export const updateEvent =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const idParam =
        req.params.id;
      const id =
        Array.isArray(idParam)
          ? idParam[0]
          : idParam;
      const result =
        await eventService.updateEvent(
          getUserId(req),
          id,
          req.body
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * ============================================
 * DELETE EVENT
 * ============================================
 */

export const deleteEvent =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       const idParam =
        req.params.id;

      const id =
        Array.isArray(idParam)
          ? idParam[0]
          : idParam;
      const result =
        await eventService.deleteEvent(
          getUserId(req),
         id
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * ============================================
 * RESEND EVENT
 * ============================================
 */

export const resendEvent =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       const idParam =
        req.params.id;

      const id =
        Array.isArray(idParam)
          ? idParam[0]
          : idParam;
      const result =
        await eventService.resendEvent(
          getUserId(req),
          id
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
        notify: true,
      });
    } catch (error) {
      next(error);
    }
  };
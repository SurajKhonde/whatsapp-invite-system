import { Request, Response, NextFunction } from "express";
import { whatsappTemplateService } from "@modules/whatsapp/whatsapp-templates.service";
import { imageGenerationService } from "@modules/image-generation/image-generation.service";
import { eventService } from "@modules/event/event.service";
import { sendResponse } from "@utils/response";
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";

// ============================================
// WhatsApp Templates Controller
// ============================================

export const getWhatsappTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await whatsappTemplateService.getAllTemplates();
    return sendResponse({ res, statusCode: 200, ...result });
  } catch (err) {
    next(err);
  }
};

export const getWhatsappTemplate = async (
  req: Request<{ templateId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { templateId } = req.params;
    const result = await whatsappTemplateService.getTemplate(templateId);
    return sendResponse({ res, statusCode: 200, ...result });
  } catch (err) {
    next(err);
  }
};

// ============================================
// Image Generation Controller
// ============================================

export const generateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const {
      eventType,
      groomName,
      brideName,
      celebrantName,
      eventName,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      schoolName,
      location,
    } = req.body;

    // Validate required fields
    if (!eventType || !eventDate || !venueName) {
      throw new AppError(
        "Missing required fields: eventType, eventDate, venueName",
        400
      );
    }

    const result = await imageGenerationService.generateImage({
      userId,
      eventType,
      groomName,
      brideName,
      celebrantName,
      eventName,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      schoolName,
      location,
    });

    return sendResponse({
      res,
      statusCode: 200,
      message: "Image generation queued",
      data: result,
      notify: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getImageStatus = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;

    const result = await imageGenerationService.getJobStatus(jobId);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Image status fetched",
      data: result,
      notify: false,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// Event Controller
// ============================================

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const {
      whatsappTemplateId,
      messageType,
      templateParams,
      imageUrl,
      guestIds,
      paymentId,
    } = req.body;

    // Validate required fields
    if (!whatsappTemplateId || !messageType || !templateParams || !guestIds || !paymentId) {
      throw new AppError(
        "Missing required fields: whatsappTemplateId, messageType, templateParams, guestIds, paymentId",
        400
      );
    }

    const result = await eventService.createEvent({
      userId,
      whatsappTemplateId,
      messageType,
      templateParams,
      imageUrl,
      guestIds,
      paymentId,
    });

    return sendResponse({
      res,
      statusCode: 201,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventStatus = async (
  req: Request<{ eventId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { eventId } = req.params;

    const result = await eventService.getEventStatus(userId, eventId);

    return sendResponse({
      res,
      statusCode: 200,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await eventService.getEvents(userId);

    return sendResponse({
      res,
      statusCode: 200,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
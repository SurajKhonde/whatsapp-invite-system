// src/modules/whatsapp/whatsapp.controller.ts

import {
  Request,
  Response,
  NextFunction,
} from "express";

import { whatsappTemplateService }
from "@modules/whatsapp/whatsapp-templates.service";



import { sendResponse }
from "@utils/response";

import { AppError }
from "@core/errors/AppError";

import { logger }
from "@core/logger/logger";

/**
 * ============================================
 * GET ALL WHATSAPP TEMPLATES
 * ============================================
 */

export const getWhatsappTemplates =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await whatsappTemplateService.getAllTemplates();

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

/**
 * ============================================
 * GET SINGLE TEMPLATE
 * ============================================
 */

export const getWhatsappTemplate =
  async (
    req: Request<{
      templateId: string;
    }>,

    res: Response,

    next: NextFunction
  ) => {
    try {
      const {
        templateId,
      } = req.params;

      const result =
        await whatsappTemplateService.getTemplate(
          templateId
        );

      return sendResponse({
        res,
        statusCode: 200,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };
import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  whatsappTemplateService,
} from "@modules/whatsapp/whatsapp-templates.service";

import {
  eventService,
} from "@modules/whatsapp/event.service";

import {
  sendResponse,
} from "@utils/response";

import {
  AppError,
} from "@core/errors/AppError";

import {
  logger,
} from "@core/logger/logger";

/**
 * ============================================
 * HELPERS
 * ============================================
 */

const getUserId = (
  req: Request
): string => {
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
 * GET ALL WHATSAPP TEMPLATES
 * ============================================
 */

export const getWhatsappTemplates =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await whatsappTemplateService.getAllTemplates();

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
 * GET SINGLE TEMPLATE
 * ============================================
 */

export const getWhatsappTemplate =
  async (
    req: Request<{
      templateId: string;
    }>,

    res: Response,

    next: NextFunction
  ) => {
    try {
      const {
        templateId,
      } = req.params;

      const result =
        await whatsappTemplateService.getTemplate(
          templateId
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


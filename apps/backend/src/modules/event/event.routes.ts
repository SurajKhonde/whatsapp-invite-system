// src/modules/event/event.routes.ts

import { Router } from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  getEventStatus,
  updateEvent,
  deleteEvent,
  resendEvent,
} from "./event.controller";

import { authMiddleware }
from "@middlewares/auth.middleware";

const router = Router();

/**
 * ============================================
 * CREATE EVENT
 * ============================================
 */

router.post(
  "/",
  authMiddleware,
  createEvent
);

/**
 * ============================================
 * GET ALL EVENTS
 * ============================================
 */

router.get(
  "/",
  authMiddleware,
  getEvents
);

/**
 * ============================================
 * GET SINGLE EVENT
 * ============================================
 */

router.get(
  "/:id",
  authMiddleware,
  getEventById
);

/**
 * ============================================
 * GET EVENT STATUS
 * ============================================
 */

router.get(
  "/:eventId/status",
  authMiddleware,
  getEventStatus
);

/**
 * ============================================
 * UPDATE EVENT
 * ============================================
 */

router.patch(
  "/:id",
  authMiddleware,
  updateEvent
);

/**
 * ============================================
 * DELETE EVENT
 * ============================================
 */

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);

/**
 * ============================================
 * RESEND EVENT
 * ============================================
 */

router.post(
  "/:id/resend",
  authMiddleware,
  resendEvent
);

export default router;
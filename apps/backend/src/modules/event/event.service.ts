import { db } from "@/db/index";
import { events } from "@/db/schema/events.schema";
import { eventGuests } from "@/db/schema/events-guests";

import { guests } from "@/db/schema/guest.schema";
import { eq, and } from "drizzle-orm";
import { inviteQueue } from "@queue/invite.queue";
import { whatsappTemplateService } from "@modules/whatsapp/whatsapp-templates.service";
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";

type CreateEventPayload = {
  userId: string;
  whatsappTemplateId: string;
  messageType: "text_only" | "image_only" | "image_and_text";
  templateParams: Record<string, string>; // { groomName, brideName, eventDate, venue, etc. }
  imageUrl?: string; // Optional: generated image URL
  guestIds: string[];
  paymentId: string;
};

export class EventService {
  /**
   * Create event and queue WhatsApp message sending
   */
  async createEvent(payload: CreateEventPayload) {
    try {
      // 1️⃣ Validate WhatsApp template exists
      const template = await whatsappTemplateService.getTemplate(
        payload.whatsappTemplateId
      );

      if (!template) {
        throw new AppError("WhatsApp template not found", 404);
      }

      logger.info(
        { templateId: payload.whatsappTemplateId },
        "Template validated"
      );

      // 2️⃣ Validate template parameters
      const validation = whatsappTemplateService.validateParameters(
        template.data,
        payload.templateParams
      );

      if (!validation.valid) {
        throw new AppError(
          `Missing template parameters: ${validation.missingFields.join(", ")}`,
          400
        );
      }

      logger.info({}, "Template parameters validated");

      // 3️⃣ Determine event type from template
      const eventType = template.data.category; // "wedding", "birthday", etc.

      // 4️⃣ Create event
      const [event] = await db
        .insert(events)
        .values({
          userId: payload.userId,
          templateId: "placeholder-template-id", // From UI template (image template)
          eventType,
          whatsappTemplateId: payload.whatsappTemplateId,
          messageType: payload.messageType,
          templateParams: payload.templateParams,
          imageUrl: payload.imageUrl || null,
          imageApprovedAt: payload.imageUrl ? new Date() : null,
          status: "processing",
          totalGuests: payload.guestIds.length,
        })
        .returning();

      logger.info(
        { eventId: event.id, totalGuests: payload.guestIds.length },
        "Event created"
      );

      // 5️⃣ Create event-guest relationships
      const insertedGuests = await db
        .insert(eventGuests)
        .values(
          payload.guestIds.map((guestId) => ({
            eventId: event.id,
            guestId,
            status: "pending",
          }))
        )
        .returning();

      logger.info(
        { eventId: event.id, count: insertedGuests.length },
        "Event guests created"
      );

      // 6️⃣ Queue WhatsApp jobs for each guest
      // 6️⃣ Queue WhatsApp jobs for each guest
const queuedJobs = await Promise.all(
  insertedGuests.map((eventGuest) =>
    inviteQueue.add("send-invite", {
      eventId: event.id,
      eventGuestId: eventGuest.id,
      userId: payload.userId,
      guestPhone: "", // Will be decrypted in worker
      guestName: "", // Will be fetched in worker
      
      // ✨ NEW: Use template data
      templateId: event.templateId || "", // Placeholder template ID
      templateName: template.data.templateName || "", // Fallback for null
      whatsappTemplateId: payload.whatsappTemplateId,
      
      // Template parameters
      templateParams: payload.templateParams,
      whatsappLanguageCode: template.data.whatsappLanguageCode || "en",
      
      // Image handling
      imageUrl: payload.imageUrl || undefined,
      hasImage: !!payload.imageUrl,
      
      // Not a retry
      isRetry: false,
    })
  )
); 

      logger.info(
        { eventId: event.id, queuedCount: queuedJobs.length },
        "WhatsApp jobs queued"
      );

      return {
        message: `Event created! Sending ${payload.guestIds.length} WhatsApp invites...`,
        data: {
          eventId: event.id,
          totalGuests: payload.guestIds.length,
          status: "processing",
        },
        notify: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ error }, "Error creating event");
      throw new AppError("Failed to create event", 500);
    }
  }

  /**
   * Get event status with real-time delivery counts
   */
  async getEventStatus(userId: string, eventId: string) {
    try {
      // Get event
      const [event] = await db
        .select()
        .from(events)
        .where(and(eq(events.id, eventId), eq(events.userId, userId)));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      // Get guest list with statuses
      const guestList = await db
        .select({
          id: eventGuests.id,
          name: guests.name,
          phone: guests.phone,
          status: eventGuests.status,
          whatsappStatus: eventGuests.whatsappStatus,
          deliveredAt: eventGuests.deliveredAt,
          readAt: eventGuests.readAt,
          errorMessage: eventGuests.errorMessage,
        })
        .from(eventGuests)
        .leftJoin(guests, eq(eventGuests.guestId, guests.id))
        .where(eq(eventGuests.eventId, eventId));

      // Calculate summary
      const summary = {
        total: guestList.length,
        pending: guestList.filter((g) => g.status === "pending").length,
        sent: guestList.filter((g) => g.whatsappStatus === "sent").length,
        delivered: guestList.filter((g) => g.whatsappStatus === "delivered").length,
        read: guestList.filter((g) => g.whatsappStatus === "read").length,
        failed: guestList.filter((g) => g.status === "failed").length,
      };

      logger.info({ eventId, summary }, "Event status fetched");

      return {
        message: "Event status fetched",
        data: {
          event,
          summary,
          guests: guestList,
        },
        notify: false,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ eventId, error }, "Error fetching event status");
      throw new AppError("Failed to fetch event status", 500);
    }
  }

  /**
   * Get all events for a user
   */
  async getEvents(userId: string) {
    try {
      const userEvents = await db
        .select()
        .from(events)
        .where(eq(events.userId, userId));

      logger.info({ userId, count: userEvents.length }, "Events fetched");

      return {
        message: "Events fetched",
        data: userEvents,
        notify: false,
      };
    } catch (error) {
      logger.error({ userId, error }, "Error fetching events");
      throw new AppError("Failed to fetch events", 500);
    }
  }
}

export const eventService = new EventService();
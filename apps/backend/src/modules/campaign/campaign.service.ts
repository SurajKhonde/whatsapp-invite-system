import { db } from "@/db/index";
import { events } from "@/db/schema/events.schema";
import { eventGuests } from "@/db/schema/events-guests"; // ✅ FIXED: was importing from events.schema
import { guests } from "@/db/schema/guest.schema";
import { templates } from "@/db/schema/template.schema";
import { eq, sql } from "drizzle-orm";
import { inviteQueue } from "@queue/invite.queue";
import { whatsappTemplateService } from "@modules/whatsapp/whatsapp-templates.service";
import { sendWhatsAppTemplate, validateTemplateBeforeSending } from "@modules/whatsapp/whatsapp-send";
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";

type CreateCampaignPayload = {
  userId: string;
  eventId: string;
};

export class CampaignService {
  /**
   * Start sending WhatsApp invites for an event
   * 
   * NEW: Uses universal templates schema
   * NEW: Uses validateTemplateBeforeSending for validation
   * NEW: Queues jobs with proper template parameters
   */
  async startCampaign(payload: CreateCampaignPayload) {
    try {
      const { userId, eventId } = payload;

      // 1️⃣ Get event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      logger.info({ eventId }, "Event found");

      // 2️⃣ Get all event guests
      const eventGuestsList = await db
        .select()
        .from(eventGuests)
        .where(eq(eventGuests.eventId, eventId));

      if (eventGuestsList.length === 0) {
        throw new AppError("No guests found for this event", 404);
      }

      logger.info({ eventId, count: eventGuestsList.length }, "Event guests found");

      // 3️⃣ Get template details (from universal templates table)
      // Uses templateId from event (database ID)
      if (!event.templateId) {
        throw new AppError("Template not selected for this event", 400);
      }

      const templateResponse = await whatsappTemplateService.getTemplate(
        event.templateId
      );
      const template = templateResponse.data;

      if (!template) {
        throw new AppError("WhatsApp template not found", 404);
      }

      // Validate template is approved
      if (template.whatsappStatus !== "APPROVED") {
        throw new AppError(
          `Template not approved for WhatsApp (Status: ${template.whatsappStatus})`,
          403
        );
      }

      // Validate whatsappTemplateId exists
      if (!template.whatsappTemplateId) {
        throw new AppError("Template not synced with WhatsApp", 400);
      }

      logger.info(
        {
          templateId: event.templateId,
          templateName: template.templateName,
          status: template.whatsappStatus,
        },
        "Template found and approved"
      );

      // 4️⃣ Validate template parameters
      const templateParams = (event.templateParams as Record<string, string>) || {};
      const validation = whatsappTemplateService.validateParameters(
        template,
        templateParams
      );

      if (!validation.valid) {
        throw new AppError(
          `Invalid template parameters. Missing: ${validation.missingFields.join(", ")}`,
          400
        );
      }

      logger.info(
        { templateId: event.templateId, paramCount: Object.keys(templateParams).length },
        "Template parameters validated"
      );

      // 5️⃣ Queue jobs for each guest
      const queuedJobs = await Promise.all(
        eventGuestsList.map(async (eventGuest) => {
          // Get guest details
          const [guest] = await db
            .select()
            .from(guests)
            .where(eq(guests.id, eventGuest.guestId));

          if (!guest) {
            logger.warn({ guestId: eventGuest.guestId }, "Guest not found, skipping");
            return null;
          }

          // Pre-validate before queueing
          const guestValidation = await validateTemplateBeforeSending(
  event.templateId as string,
  templateParams,
  guest.phone
);

          if (!guestValidation.valid) {
            logger.warn(
              {
                guestId: eventGuest.guestId,
                errors: guestValidation.errors,
              },
              "Guest validation failed, skipping"
            );
            return null;
          }

          // Queue job with new format
          // Type safety: These values are guaranteed non-null due to earlier checks
          return inviteQueue.add("send-invite", {
            eventId: event.id,
            eventGuestId: eventGuest.id,
            userId: userId,
            guestPhone: guest.phone,
            guestName: guest.name,
            templateId: event.templateId as string, // Guaranteed non-null by earlier check
            templateName: template.templateName as string, // Guaranteed non-null
            whatsappTemplateId: template.whatsappTemplateId as string, // Guaranteed non-null by earlier check
            templateParams: templateParams,
            whatsappLanguageCode: template.whatsappLanguageCode || "en",
            imageUrl: event.imageUrl || undefined,
            hasImage: template.hasImage || false,
          });
        })
      );

      const successCount = queuedJobs.filter((job) => job !== null).length;

      if (successCount === 0) {
        throw new AppError("No guests could be queued for sending", 400);
      }

      logger.info(
        { eventId, queuedCount: successCount, totalGuests: eventGuestsList.length },
        "Campaign jobs queued"
      );

      // 6️⃣ Update event status
      await db
        .update(events)
        .set({
          status: "processing",
          updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));

      return {
        message: `Campaign started! Sending ${successCount} WhatsApp invites...`,
        data: {
          eventId: event.id,
          templateName: template.templateName,
          totalGuests: successCount,
          failedGuests: eventGuestsList.length - successCount,
          status: "processing",
        },
        notify: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ error }, "Error starting campaign");
      throw new AppError("Failed to start campaign", 500);
    }
  }

  /**
   * Get campaign status
   * 
   * Returns event status with guest delivery tracking
   */
  async getCampaignStatus(userId: string, eventId: string) {
    try {
      // Get event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      // Get template info
      let templateInfo = null;
      try {
        if (event.templateId) {
          const templateResponse = await whatsappTemplateService.getTemplate(
            event.templateId
          );
          templateInfo = {
            name: templateResponse.data.templateName,
            status: templateResponse.data.whatsappStatus,
          };
        }
      } catch (error) {
        logger.warn({ templateId: event.templateId }, "Template not found for event");
      }

      // Get guest list with statuses
      const guestList = await db
        .select({
          id: eventGuests.id,
          name: guests.name,
          phone: guests.phone,
          status: eventGuests.status,
          whatsappStatus: eventGuests.whatsappStatus,
          sentAt: eventGuests.sentAt,
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

      logger.info({ eventId, summary }, "Campaign status fetched");

      return {
        message: "Campaign status fetched",
        data: {
          event: {
            id: event.id,
            eventName: event.eventName,
            eventType: event.eventType,
            status: event.status,
            totalGuests: event.totalGuests,
            template: templateInfo,
            createdAt: event.createdAt,
          },
          summary,
          guests: guestList,
        },
        notify: false,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ eventId, error }, "Error fetching campaign status");
      throw new AppError("Failed to fetch campaign status", 500);
    }
  }

  /**
   * Get all events for a user
   * 
   * NEW: Uses universal templates table
   * Shows template info and campaign statistics
   */
  async getEvents(userId: string) {
    try {
      const data = await db
        .select({
          id: events.id,
          eventName: events.eventName,
          eventType: events.eventType,
          templateName: templates.templateName,
          templateTitle: templates.title,
          whatsappStatus: templates.whatsappStatus,
          totalGuests: events.totalGuests,
          sentCount: sql<number>`
            COUNT(*) FILTER (WHERE ${eventGuests.whatsappStatus} = 'sent')
          `,
          deliveredCount: sql<number>`
            COUNT(*) FILTER (WHERE ${eventGuests.whatsappStatus} = 'delivered')
          `,
          readCount: sql<number>`
            COUNT(*) FILTER (WHERE ${eventGuests.whatsappStatus} = 'read')
          `,
          failedCount: sql<number>`
            COUNT(*) FILTER (WHERE ${eventGuests.status} = 'failed')
          `,
          createdAt: events.createdAt,
          updatedAt: events.updatedAt,
          status: events.status,
        })
        .from(events)
        .leftJoin(templates, eq(events.templateId, templates.id))
        .leftJoin(eventGuests, eq(eventGuests.eventId, events.id))
        .where(eq(events.userId, userId))
        .groupBy(events.id, templates.templateName, templates.title, templates.whatsappStatus);

      logger.info({ userId, count: data.length }, "Events fetched");

      return {
        message: "Events fetched",
        data,
        notify: false,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ userId, error }, "Error fetching events");
      throw new AppError("Failed to fetch events", 500);
    }
  }

  /**
   * Get detailed event info
   * 
   * NEW: Returns complete event with template details
   */
  async getEventDetails(userId: string, eventId: string) {
    try {
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      // Get template
      let template = null;
      try {
        if (event.templateId) {
          const templateResponse = await whatsappTemplateService.getTemplate(
            event.templateId
          );
          template = templateResponse.data;
        }
      } catch (error) {
        logger.warn({ templateId: event.templateId }, "Template not found");
      }

      // Get guest count
      const guestCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(eventGuests)
        .where(eq(eventGuests.eventId, eventId));

      logger.info({ eventId }, "Event details fetched");

      return {
        message: "Event details fetched",
        data: {
          event,
          template: template ? {
            id: template.id,
            name: template.templateName,
            title: template.title,
            category: template.category,
            status: template.whatsappStatus,
            hasImage: template.hasImage,
            parameters: template.parameters,
          } : null,
          guestCount: guestCount[0]?.count || 0,
        },
        notify: false,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ eventId, error }, "Error fetching event details");
      throw new AppError("Failed to fetch event details", 500);
    }
  }

  /**
   * Cancel campaign
   */
  async cancelCampaign(userId: string, eventId: string) {
    try {
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      // Can only cancel if not completed
      if (event.status === "completed") {
        throw new AppError("Cannot cancel a completed campaign", 400);
      }

      // Update event status
      await db
        .update(events)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));

      logger.info({ eventId, previousStatus: event.status }, "Campaign cancelled");

      return {
        message: "Campaign cancelled successfully",
        data: { eventId, previousStatus: event.status },
        notify: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ eventId, error }, "Error cancelling campaign");
      throw new AppError("Failed to cancel campaign", 500);
    }
  }

  /**
   * Retry failed guests
   * 
   * NEW: Retry sending to guests that failed
   */
  async retryFailedGuests(userId: string, eventId: string) {
    try {
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      // Get failed guests
      const failedGuests = await db
        .select({
          id: eventGuests.id,
          guestId: eventGuests.guestId,
        })
        .from(eventGuests)
        .where(eq(eventGuests.eventId, eventId) && eq(eventGuests.status, "failed"));

      if (failedGuests.length === 0) {
        return {
          message: "No failed guests to retry",
          data: { eventId, retryCount: 0 },
          notify: false,
        };
      }

      // Get template
      if (!event.templateId) {
        throw new AppError("Template not selected for this event", 400);
      }

      const templateResponse = await whatsappTemplateService.getTemplate(
        event.templateId
      );
      const template = templateResponse.data;

      // Validate whatsappTemplateId exists
      if (!template.whatsappTemplateId) {
        throw new AppError("Template not synced with WhatsApp", 400);
      }

      const templateParams = (event.templateParams as Record<string, string>) || {};

      // Queue retry jobs
      const retryJobs = await Promise.all(
        failedGuests.map(async (failedGuest) => {
          const [guest] = await db
            .select()
            .from(guests)
            .where(eq(guests.id, failedGuest.guestId));

          if (!guest) return null;

          return inviteQueue.add("send-invite", {
            eventId: event.id,
            eventGuestId: failedGuest.id,
            userId: userId,
            guestPhone: guest.phone,
            guestName: guest.name,
            templateId: event.templateId as string, // Guaranteed non-null by earlier check
            templateName: template.templateName as string, // Guaranteed non-null
            whatsappTemplateId: template.whatsappTemplateId as string, // Guaranteed non-null by earlier check
            templateParams: templateParams,
            whatsappLanguageCode: template.whatsappLanguageCode || "en",
            imageUrl: event.imageUrl || undefined,
            hasImage: template.hasImage || false,
            isRetry: true,
          });
        })
      );

      const successCount = retryJobs.filter((job) => job !== null).length;

      logger.info(
        { eventId, retryCount: successCount },
        "Retry jobs queued"
      );

      return {
        message: `Retrying ${successCount} failed guests...`,
        data: { eventId, retryCount: successCount },
        notify: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ eventId, error }, "Error retrying failed guests");
      throw new AppError("Failed to retry guests", 500);
    }
  }
}

export const campaignService = new CampaignService();
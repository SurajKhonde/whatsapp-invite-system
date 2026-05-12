

import { AppError }
from "@core/errors/AppError";

import { logger }
from "@core/logger/logger";

import { db }
from "@/db/index";

import {
  eq,
  and,
} from "drizzle-orm";

import { events }
from "@/db/schema/events.schema";

import {
  textTemplateRepository
} from "@modules/textmessageTemplate/text-template.repository";

import {
  generateFinalInviteImage,
} from "@modules/image-generation/generate-final-image.service";

import {
  inviteQueue,
} from "@queue/invite.queue";

import {
  getGuestById,
} from "@modules/guest/guest.repo";

export class EventService {

  async createEvent(payload: {
    userId: string;
    templateId?: string;
    messageType:
      | "text_only"
      | "image_only"
      | "image_and_text";

    templateParams: Record<
      string,
      string
    >;

    guestIds: string[];
  }) {
    try {
      const {
        userId,
        templateId,
        messageType,
        templateParams,
        guestIds,
      } = payload;

      if (
        ![
          "text_only",
          "image_only",
          "image_and_text",
        ].includes(messageType)
      ) {
        throw new AppError(
          "Invalid message type",
          400
        );
      }

      let selectedTemplate: any =
        null;

      if (templateId) {
        const result = await textTemplateRepository.getTemplateById(templateId);

        selectedTemplate =result;

        if (!selectedTemplate) {
          throw new AppError(
            "Template not found",
            404
          );
        }
      }


      if (selectedTemplate) {
        const validation =
          textTemplateRepository.validateParameters(
            selectedTemplate,
            templateParams
          );

        if (!validation.valid) {
          throw new AppError(
            `Missing fields: ${validation.missingFields.join(
              ", "
            )}`,
            400
          );
        }
      }


      let finalImageUrl:
        | string
        | null = null;

      if (
        selectedTemplate?.type ===
        "image"
      ) {
        const imageResult =
          await generateFinalInviteImage(
            {
              category:
                selectedTemplate.category,

              htmlTemplateName:
                selectedTemplate.htmlTemplateName,

              templateParams,
            }
          );

        finalImageUrl =
          imageResult.imageUrl;
      }


      const [event] =
        await db
          .insert(events)
          .values({
            userId,

            templateId:
              templateId ||
              null,

            templateName:
              selectedTemplate?.templateName ||
              null,

            whatsappTemplateId:
              selectedTemplate?.whatsappTemplateId ||
              "",

            messageType,

            imageUrl:
              finalImageUrl ||
              undefined,

            templateParams,

            totalGuests:
              guestIds.length,
          })
          .returning();

      let orderedParameters:
        string[] = [];

      if (
        selectedTemplate?.parameters
      ) {
        orderedParameters =
          (
            selectedTemplate.parameters as any[]
          )
            .sort(
              (
                a: any,
                b: any
              ) =>
                a.index -
                b.index
            )
            .map(
              (param: any) =>
                templateParams[
                  param.key
                ] || ""
            );
      }


      for (const guestId of guestIds) {
        const guest =
          await getGuestById(
            guestId
          );

        if (!guest) {
          continue;
        }

        await inviteQueue.add(
          "send-invite",
          {
            eventId:
              event.id,

            guestId,

            guestPhone:
              guest.phone,

            guestName:
              guest.name,

            messageType,

            templateId:
              selectedTemplate?.id ||
              undefined,

            templateName:
              selectedTemplate?.templateName ||
              undefined,

            whatsappTemplateId:
              selectedTemplate?.whatsappTemplateId ||
              undefined,

            whatsappLanguageCode:
              selectedTemplate?.whatsappLanguageCode ||
              "en",

            parameters:
              orderedParameters,

            templateParams,

            imageUrl:
              finalImageUrl ||
              undefined,

            hasImage:
              !!finalImageUrl,
          }
        );
      }

      return {
        success: true,

        message:
          "Event created successfully",

        data: {
          event,

          imageUrl:
            finalImageUrl,

          totalGuests:
            guestIds.length,
        },
      };
    } catch (error) {
      logger.error(
        { error },
        "Create event failed"
      );

      throw error;
    }
  }

  /**
   * ============================================
   * GET EVENTS
   * ============================================
   */

  async getEvents(
    userId: string
  ) {
    const result =
      await db
        .select()
        .from(events)
        .where(
          eq(
            events.userId,
            userId
          )
        );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * ============================================
   * GET EVENT BY ID
   * ============================================
   */

  async getEventById(
    userId: string,
    eventId: string
  ) {
    const result =
      await db
        .select()
        .from(events)
        .where(
          and(
            eq(
              events.id,
              eventId
            ),

            eq(
              events.userId,
              userId
            )
          )
        );

    const event =
      result[0];

    if (!event) {
      throw new AppError(
        "Event not found",
        404
      );
    }

    return {
      success: true,
      data: event,
    };
  }

  /**
   * ============================================
   * GET EVENT STATUS
   * ============================================
   */

  async getEventStatus(
    userId: string,
    eventId: string
  ) {
    return this.getEventById(
      userId,
      eventId
    );
  }

  /**
   * ============================================
   * UPDATE EVENT
   * ============================================
   */

  async updateEvent(
    userId: string,
    eventId: string,
    payload: any
  ) {
    await this.getEventById(
      userId,
      eventId
    );

    const [updatedEvent] =
      await db
        .update(events)
        .set({
          ...payload,
          updatedAt:
            new Date(),
        })
        .where(
          eq(
            events.id,
            eventId
          )
        )
        .returning();

    return {
      success: true,
      message:
        "Event updated successfully",
      data: updatedEvent,
    };
  }

  /**
   * ============================================
   * DELETE EVENT
   * ============================================
   */

  async deleteEvent(
    userId: string,
    eventId: string
  ) {
    await this.getEventById(
      userId,
      eventId
    );

    await db
      .delete(events)
      .where(
        eq(
          events.id,
          eventId
        )
      );

    return {
      success: true,
      message:
        "Event deleted successfully",
    };
  }

  /**
   * ============================================
   * RESEND EVENT
   * ============================================
   */

  async resendEvent(
    userId: string,
    eventId: string
  ) {
    const eventResult =
      await this.getEventById(
        userId,
        eventId
      );

    return {
      success: true,
      message:
        "Event resend queued",
      data:
        eventResult.data,
    };
  }
}

export const eventService =
  new EventService();
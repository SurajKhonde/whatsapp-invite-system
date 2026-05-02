import { db } from "@/db/index";
import { eventGuests } from "@/db/schema/events-guests";
import { guests } from "@/db/schema/guest.schema";
import { events } from "@/db/schema/events.schema";
import { templates } from "@/db/schema/template.schema";
import { eq, and, sql } from "drizzle-orm";
import { inviteQueue } from "@queue/invite.queue";
import { AppError } from "@core/errors/AppError";

type CreateEventPayload = {
  templateId: string;
  eventType: string;
  guests: string[];
};

export class EventService {
  // ✅ CREATE EVENT
  async createEvent(userId: string, payload: CreateEventPayload) {
    const { templateId, eventType, guests: guestIds } = payload;

    const [event] = await db
      .insert(events)
      .values({
        userId,
        templateId,
        eventType,
        totalGuests: guestIds.length,
        status: "processing",
      })
      .returning();

    const insertedGuests = await db
      .insert(eventGuests)
      .values(
        guestIds.map((guestId) => ({
          eventId: event.id,
          guestId,
          status: "pending",
        }))
      )
      .returning();

    await Promise.all(
      insertedGuests.map((row) =>
        inviteQueue.add("send-invite", {
          eventId: event.id,
          eventGuestId: row.id,
          userId,
        })
      )
    );

    return {
      message: "Event created successfully",
      data: event,
      notify: true,
    };
  }

  // ✅ GET ALL EVENTS
  async getEvents(userId: string) {
    const data = await db
      .select({
        id: events.id,
        eventType: events.eventType,
        templateName: templates.title,
        totalGuests: events.totalGuests,

        sentCount: sql<number>`
          COUNT(*) FILTER (WHERE ${eventGuests.status} = 'sent')
        `,

        failedCount: sql<number>`
          COUNT(*) FILTER (WHERE ${eventGuests.status} = 'failed')
        `,

        createdAt: events.createdAt,
        status: events.status,
      })
      .from(events)
      .leftJoin(templates, eq(events.templateId, templates.id))
      .leftJoin(eventGuests, eq(eventGuests.eventId, events.id))
      .where(eq(events.userId, userId))
      .groupBy(events.id, templates.title);

    return {
      message: "Events fetched",
      data,
      notify: false, // 🔥 no toast
    };
  }

  // ✅ GET EVENT DETAILS
  async getEventDetails(userId: string, eventId: string) {
    const event = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)))
      .limit(1);

    if (!event.length) {
      throw new AppError("Event not found", 404);
    }

    const guestList = await db
      .select({
        id: eventGuests.id,
        name: guests.name,
        phone: guests.phone,
        status: eventGuests.status,
      })
      .from(eventGuests)
      .leftJoin(guests, eq(eventGuests.guestId, guests.id))
      .where(eq(eventGuests.eventId, eventId));

    return {
      message: "Event details fetched",
      data: {
        event: event[0],
        guests: guestList,
      },
      notify: false, // 🔥 no toast
    };
  }
}
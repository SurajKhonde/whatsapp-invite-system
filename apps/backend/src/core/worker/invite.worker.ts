import { Worker, Job } from "bullmq";
import { redisQueue } from "@config/redis";
import { db } from "@/db/index";
import { eventGuests } from "@/db/schema/events-guests";
import { guests } from "@/db/schema/guest.schema";
import { eq } from "drizzle-orm";
import { InviteJob } from "../queue/invite.queue";
import { revealGuestPhones } from "@modules/guest/guest.repo";
import { sendWhatsAppTemplate } from "@modules/whatsapp/whatsapp.service";
import { logger } from "@core/logger/logger";

new Worker<InviteJob>(
  "inviteQueue",
  async (job: Job<InviteJob>) => {
    const {
      eventGuestId,
      userId,
      templateName,
      templateParams,
      messageType,
      imageUrl,
    } = job.data;

    logger.info({ eventGuestId, templateName }, "Processing WhatsApp job");

    try {
      // 1️⃣ Get event guest
      const [row] = await db
        .select()
        .from(eventGuests)
        .where(eq(eventGuests.id, eventGuestId));

      if (!row) {
        throw new Error("Event guest not found");
      }

      // 2️⃣ Get guest details (name and phone)
      const [guest] = await db
        .select()
        .from(guests)
        .where(eq(guests.id, row.guestId));

      if (!guest) {
        throw new Error("Guest not found");
      }

      // 3️⃣ Decrypt guest phone
      const decryptedGuests = await revealGuestPhones(userId, [guest.id]);
      const decryptedGuest = decryptedGuests[0];

      if (!decryptedGuest || !decryptedGuest.phone) {
        throw new Error("Guest phone not found or cannot be decrypted");
      }

      logger.info(
        { guestId: guest.id, phone: decryptedGuest.phone },
        "Guest phone decrypted"
      );

      // 4️⃣ Prepare template parameters with guest name
      const finalParams = {
        ...templateParams,
        guestName: guest.name || "Friend", // Replace with actual guest name
      };

      // 5️⃣ Send WhatsApp template message
      logger.info(
        { phone: decryptedGuest.phone, templateName },
        "Sending WhatsApp template"
      );

      const result = await sendWhatsAppTemplate({
        to: decryptedGuest.phone,
        templateName,
        templateParams: finalParams,
        messageType,
        imageUrl,
      });

      if (!result.success) {
        throw new Error(result.error || "WhatsApp API failed");
      }

      // 6️⃣ Update success status
      await db
        .update(eventGuests)
        .set({
          status: "sent",
          whatsappMessageId: result.messageId,
          whatsappStatus: "sent",
          sentAt: new Date(),
          attempts: (row.attempts ?? 0) + 1,
          lastAttemptAt: new Date(),
        })
        .where(eq(eventGuests.id, eventGuestId));

      logger.info(
        { eventGuestId, messageId: result.messageId },
        "WhatsApp message sent successfully"
      );

      return {
        success: true,
        messageId: result.messageId,
        guestName: guest.name,
      };
    } catch (err: any) {
      logger.error(
        { eventGuestId, error: err.message },
        "Error sending WhatsApp message"
      );

      // Update failure status
      await db
        .update(eventGuests)
        .set({
          status: "failed",
          whatsappStatus: "failed",
          errorMessage: err.message,
          attempts: (job.data as any).attempts ?? 0 + 1,
          lastAttemptAt: new Date(),
        })
        .where(eq(eventGuests.id, eventGuestId));

      // Throw to allow BullMQ to retry
      throw err;
    }
  },
  {
    connection: redisQueue,
    concurrency: 5, // Send 5 messages in parallel
  }
);

logger.info({}, "Invite worker started");
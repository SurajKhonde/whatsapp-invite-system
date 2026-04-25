import { Worker, Job } from "bullmq";
import { redisQueue } from "@config/redis";
import { db } from "@/db/index";
import { eventGuests } from "@/db/schema/events-guests";
import { eq } from "drizzle-orm";
import { InviteJob } from "../queue/invite.queue";

import { revealGuestPhones } from "@modules/guest/guest.repo";
import { sendWhatsAppTemplate } from "@modules/whatsapp/whatsapp.service";

new Worker<InviteJob>(
  "inviteQueue",
  async (job: Job<InviteJob>) => {
    const { eventGuestId, userId } = job.data;

    console.log("Processing guest:", eventGuestId);

    // 1️⃣ get single event guest
    const [row] = await db
      .select()
      .from(eventGuests)
      .where(eq(eventGuests.id, eventGuestId));

    if (!row) return;

    // 2️⃣ decrypt phone
    const [guest] = await revealGuestPhones(userId, [row.guestId]);

    if (!guest) {
      throw new Error("Guest phone not found");
    }

    try {
      console.log("Sending to:", guest.phone);

      const result = await sendWhatsAppTemplate({
        to: guest.phone,
        name: "Guest",
        templateName: "birthday_invite",
      });

      if (!result.success) {
        throw new Error("WhatsApp failed");
      }

      // ✅ update success
      await db
        .update(eventGuests)
        .set({
          status: "sent",
          deliveredAt: new Date(),
          attempts: (row.attempts ?? 0) + 1,
          lastAttemptAt: new Date(),
        })
        .where(eq(eventGuests.id, eventGuestId));

    } catch (err: any) {
      console.error("Error:", err.message);

      // ❌ update failure
      await db
        .update(eventGuests)
        .set({
          status: "failed",
          errorMessage: err.message,
          attempts: (row.attempts ?? 0) + 1,
          lastAttemptAt: new Date(),
        })
        .where(eq(eventGuests.id, eventGuestId));

      throw err; // 🔥 allow retry
    }
  },
  {
    connection: redisQueue,
    concurrency: 5,
  }
);
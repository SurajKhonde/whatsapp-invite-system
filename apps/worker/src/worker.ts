import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  "inviteQueue",
  async (job: Job) => {
    const guest = job.data;

    console.log("📩 Sending to:", guest.phone);

    try {
      // 🔥 TODO: Call Gupshup API here
      // await sendWhatsApp(guest);

      // ✅ Update DB → SENT
      await prisma.guest.update({
        where: { id: guest.id },
        data: { status: "SENT" },
      });

      return true;
    } catch (error) {
      console.error("❌ Error sending:", guest.phone);

      // ❌ Update DB → FAILED
      await prisma.guest.update({
        where: { id: guest.id },
        data: { status: "FAILED" },
      });

      throw error; // important for retry
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

// ✅ Events
worker.on("completed", (job) => {
  console.log("✅ Done:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("❌ Failed:", job?.id, err.message);
});
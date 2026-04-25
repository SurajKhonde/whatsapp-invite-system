import { Queue } from "bullmq";
import { redisQueue } from "../../config/redis";

/* 🔥 define job type */
export type InviteJob = {
  eventId: string;
  eventGuestId: string;
  userId: string;
};



export const inviteQueue = new Queue("inviteQueue", {
  connection: redisQueue,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
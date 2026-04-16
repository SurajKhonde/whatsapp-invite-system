import { Queue } from "bullmq";
import { redisQueue } from "../../config/redis";

export const otpQueue = new Queue("otpQueue", {
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
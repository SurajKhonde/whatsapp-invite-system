import { Queue } from "bullmq";
import { redisQueue } from "../../config/redis";

export const otpQueue = new Queue("otpQueue", {
  connection: redisQueue,
});
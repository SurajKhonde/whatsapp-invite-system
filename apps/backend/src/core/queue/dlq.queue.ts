import { Queue } from "bullmq";
import { redisQueue } from "@config/redis";

export const dlqQueue = new Queue("otpDLQ", {
  connection: redisQueue,
});
import { Worker } from "bullmq";
import { redisQueue } from "@config/redis";
import { sendEmail } from "@modules/emailOtpManger/emailDelivery.service";
import { getOtpTemplate } from "@modules/template/otpTemplate";
import { RetryableError, NonRetryableError } from "@utils/errorClass";
import { dlqQueue } from "@core/queue/dlq.queue";
import { logger } from "@core/logger/logger";

new Worker(
  "otpQueue",
  async (job) => {
    const { email, otp, purpose } = job.data;

    const { subject, html } = getOtpTemplate({ otp, purpose });

    try {
      await sendEmail({
        to: email,
        subject,
        html,
      });
    } catch (err) {
      // ❌ NON-RETRYABLE → send to DLQ
      if (err instanceof NonRetryableError) {
        await dlqQueue.add("failed-email", {
          jobData: job.data,
          reason: err.message,
        });

        logger.warn({ email, err }, "Moved to DLQ");

        return; 
      }

      if (err instanceof RetryableError) {
        logger.warn({ email, err }, "Retryable error");
        throw err; // Bull will retry
      }

      // ⚠️ unknown → retry (safe fallback)
      throw err;
    }
  },
  {
    connection: redisQueue,
    concurrency: 5,
  }
);
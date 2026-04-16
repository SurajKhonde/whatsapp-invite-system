import { Worker } from "bullmq";
import { redisQueue } from "@config/redis";
import { sendEmail } from "@modules/emailOtpManger/emailDelivery.service";
import { getOtpTemplate } from "@templates/otpTemplate";
new Worker(
  "otpQueue",
  async (job) => {
    const { email, otp, purpose } = job.data;

    const { subject, html } = getOtpTemplate({ otp, purpose });

    await sendEmail({
      to: email,
      subject,
      html,
    });
  },
  {
    connection: redisQueue,
    concurrency: 5,
  }
);
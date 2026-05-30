import { Resend } from "resend";
import nodemailer from "nodemailer";
import { logger } from "@core/logger/logger";
const resend = new Resend(process.env.RESEND_API_KEY);
import { RetryableError, NonRetryableError } from "@utils/errorClass";
const isProd = process.env.NODE_ENV === "production";

const devTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.SENDER_EMAIL!,
    pass: process.env.SENDER_EMAIL_PASSWORD!,
  },
});


export const sendEmail = async ({ to, subject, html }:{
  to: string;
  subject: string;
   html: string;
}) => {
  try {
    if (!isProd) {
      const info = await devTransporter.sendMail({
        from: '"Dev App" <dev@app.com>',
        to,
        subject,
        html,
      });
const previewUrl = nodemailer.getTestMessageUrl(info);
console.log(`Preview URL: ${previewUrl}`);
      logger.info({ to }, "Email sent (DEV)");
      return;
    }

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });

    if (response.error) {
      const error = response.error;
      const status = error.statusCode;

      if (typeof status !== "number") {
        throw new RetryableError("Unknown resend error");
      }

      if (status === 400 || status === 401 || status === 403) {
        throw new NonRetryableError(error.message);
      }

      if (status === 429 || status >= 500) {
        throw new RetryableError(error.message);
      }

      throw new RetryableError("Unhandled resend error");
    }

    logger.info(
      { to, id: response.data?.id },
      "Email sent (PROD)"
    );
  } catch (err: any) {
    logger.error({ err, to }, "Email sending failed");

    // ✅ don't re-classify known errors
    if (err instanceof NonRetryableError || err instanceof RetryableError) {
      throw err;
    }

    const status = err?.statusCode || err?.status;

    if (status === 400 || status === 401 || status === 403) {
      throw new NonRetryableError("Invalid or unauthorized request");
    }
    if (status === 429 || status >= 500) {
      throw new RetryableError("Temporary failure");
    }
    throw new RetryableError("Unknown error");
  }
};
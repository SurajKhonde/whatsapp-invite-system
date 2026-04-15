import { Resend } from "resend";
import nodemailer from "nodemailer";
import { logger } from "@core/logger/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const isProd = process.env.NODE_ENV === "production";

// 🔥 DEV (nodemailer)
const devTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    if (!isProd) {
      await devTransporter.sendMail({
        from: '"Dev App" <dev@app.com>',
        to,
        subject,
        html,
      });

      logger.info({ to }, "Email sent (DEV)");
      return;
    }

    // 🔥 PROD (Resend)
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });

    logger.info({ to }, "Email sent (PROD)");
  } catch (err) {
    logger.error({ err, to }, "Email sending failed");
    throw err;
  }
};


import {
  Worker,
  Job,
} from "bullmq";

import { redisQueue }
from "@config/redis";

import { InviteJob }
from "../queue/invite.queue";

import { sendWhatsAppTemplate }
from "@modules/whatsapp/whatsapp.service";

import { logger }
from "@core/logger/logger";

new Worker<InviteJob>(
  "inviteQueue",

  async (
    job: Job<InviteJob>
  ) => {
    const {
      eventId,

      guestId,

      guestPhone,

      guestName,

      templateName,

      templateParams,

      messageType,

      imageUrl,
    } = job.data;


    try {
      /**
       * ======================================
       * PREPARE TEMPLATE PARAMS
       * ======================================
       */

      const finalParams = {
        ...templateParams,

        guestName:
          guestName ||
          "Friend",
      };

      /**
       * ======================================
       * SEND WHATSAPP MESSAGE
       * ======================================
       */

      logger.info(
        {
          phone:
            guestPhone,

          templateName,
        },

        "📤 Sending WhatsApp template"
      );

      if (!templateName) {
        throw new Error(
          "templateName missing"
        );
      }

      const result =
        await sendWhatsAppTemplate(
          {
            to: guestPhone,

            templateName,

            templateParams:
              finalParams,

            messageType,

            imageUrl:
              imageUrl ||
              undefined,
          }
        );

      if (!result.success) {
        throw new Error(
          result.error ||
            "WhatsApp API failed"
        );
      }

      logger.info(
        {
          guestId,

          messageId:
            result.messageId,
        },

        "✅ WhatsApp sent"
      );

      return {
        success: true,

        messageId:
          result.messageId,

        guestName,
      };
    } catch (err: any) {
      logger.error(
        {
          guestId,

          error:
            err.message,
        },

        "❌ WhatsApp send failed"
      );

      throw err;
    }
  },

  {
    connection: redisQueue,

    concurrency: 5,
  }
);

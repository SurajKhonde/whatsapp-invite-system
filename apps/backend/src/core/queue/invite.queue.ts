// src/queue/invite.queue.ts

import { Queue } from "bullmq";

import { redisQueue } from "../../config/redis";

/**
 * ============================================
 * MESSAGE TYPE
 * ============================================
 */

export type MessageType =
  | "text_only"
  | "image_only"
  | "image_and_text";

/**
 * ============================================
 * INVITE QUEUE JOB TYPE
 * ============================================
 */

export interface InviteJob {
  // Event
  eventId: string;

  // Guest
  guestId: string;

  guestPhone: string;

  guestName: string;

  // Message
  messageType: MessageType;

  // Template
  templateId?: string;

  templateName?: string;

  whatsappTemplateId?: string;

  whatsappLanguageCode?: string;

  // Ordered WhatsApp parameters
  parameters?: string[];

  // Raw params
  templateParams?: Record<
    string,
    string
  >;

  // Image
  imageUrl?: string;

  hasImage?: boolean;

  // Retry
  isRetry?: boolean;
}

/**
 * ============================================
 * INVITE QUEUE
 * ============================================
 */

export const inviteQueue =
  new Queue<InviteJob>(
    "inviteQueue",
    {
      connection: redisQueue,

      defaultJobOptions: {
        attempts: 3,

        backoff: {
          type: "exponential",

          delay: 2000,
        },

        removeOnComplete: {
          age: 3600,
        },

        removeOnFail: false,
      },
    }
  );
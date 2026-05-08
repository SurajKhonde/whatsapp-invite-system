import { Queue } from "bullmq";
import { redisQueue } from "../../config/redis";

/* 🔥 define job type - Updated for universal templates schema */
export type InviteJob = {
  eventId: string;
  eventGuestId: string;
  userId: string;
  guestPhone: string;
  guestName: string;
  
  // ✨ NEW: Template identifiers (from universal templates schema)
  templateId: string;                        // Database template ID (UUID)
  templateName: string;                      // Template name (e.g., "wedding_classic_en")
  whatsappTemplateId: string;               // Official Meta template ID
  
  // Template parameters for message
  templateParams: Record<string, string>;
  whatsappLanguageCode?: string;            // Language code (default: "en")
  
  // Image handling
  imageUrl?: string;
  hasImage?: boolean;                       // ✨ NEW
  
  // Retry flag
  isRetry?: boolean;                        // ✨ NEW
};

export const inviteQueue = new Queue<InviteJob>("inviteQueue", {
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
});
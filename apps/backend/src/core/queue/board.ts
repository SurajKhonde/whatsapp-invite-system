// src/core/bull-board.ts

import { ExpressAdapter }
from "@bull-board/express";

import { createBullBoard }
from "@bull-board/api";

import { BullMQAdapter }
from "@bull-board/api/bullMQAdapter";

/**
 * ============================================
 * QUEUES
 * ============================================
 */

import { otpQueue }
from "@queue/emailOTP.queue";

import { inviteQueue }
from "@core/queue/invite.queue";

import { imageGenerationQueue }
from "@core/queue/image-generation.queue";

/**
 * ============================================
 * SERVER ADAPTER
 * ============================================
 */

const serverAdapter =
  new ExpressAdapter();

serverAdapter.setBasePath(
  "/admin/queues"
);

/**
 * ============================================
 * REGISTER ALL QUEUES
 * ============================================
 */

createBullBoard({
  queues: [
    new BullMQAdapter(
      otpQueue
    ),

    new BullMQAdapter(
      inviteQueue
    ),

    new BullMQAdapter(
      imageGenerationQueue
    ),
  ],

  serverAdapter,
});

export { serverAdapter };
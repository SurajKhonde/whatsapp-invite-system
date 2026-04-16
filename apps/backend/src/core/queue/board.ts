import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { otpQueue } from "@queue/emailOTP.queue"; 

// create server adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// register queues
createBullBoard({
  queues: [new BullMQAdapter(otpQueue)],
  serverAdapter,
});

export { serverAdapter };
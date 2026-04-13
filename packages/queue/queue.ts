// // packages/queue/queue.ts
// import { Queue } from "bullmq";
// import IORedis from "ioredis";

// const connection = new IORedis({
//   host: "localhost",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// export const inviteQueue = new Queue("inviteQueue", {
//   connection,
// });

import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const inviteQueue = new Queue("inviteQueue", {
  connection,
});
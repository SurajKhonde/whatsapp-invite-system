import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  serializers: {
    err: (err: any) => ({
      type: err?.name,
      message: err?.message,
    }),
  },

  transport: !isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      }
    : undefined,
});
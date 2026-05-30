import { logger } from "@core/logger/logger";

import "./emailOTP.worker";
import "./invite.worker";

(async () => {
  if (process.env.ENABLE_RENDER_WORKERS === "true") {
    await import("./imagegeneration.worker");
    await import("./template-render.worker");
    await import("./cloudinary-upload.worker");
    await import("./template-finalize.worker");
    logger.info("🎨 Render workers enabled");
  } else {
    logger.info("🚫 Render workers disabled (prod mode)");
  }

  logger.info("🚀 All workers started");
})();
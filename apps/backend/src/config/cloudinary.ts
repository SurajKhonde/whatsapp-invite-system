import { v2 as cloudinary }
from "cloudinary";

import { logger }
from "@core/logger/logger";

/**
 * ============================================
 * CLOUDINARY CONFIG
 * ============================================
 */

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

/**
 * ============================================
 * VERIFY CONNECTION
 * ============================================
 */

export const connectCloudinary =
  async () => {
    try {
      await cloudinary.api.ping();

      logger.info(
        "☁️ Cloudinary connected"
      );
    } catch (error) {
      logger.error(
        { error },

        "❌ Cloudinary connection failed"
      );

      process.exit(1);
    }
  };


export default cloudinary;
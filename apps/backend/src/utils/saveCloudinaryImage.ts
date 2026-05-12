
import { Readable }
from "stream";

import cloudinary
from "@config/cloudinary";

import { logger }
from "@core/logger/logger";

export interface CloudinaryUploadResult {
  secureUrl: string;

  publicId: string;

  width?: number;

  height?: number;

  bytes?: number;
}

/**
 * ============================================
 * SAVE IMAGE TO CLOUDINARY
 * ============================================
 */

export const saveCloudinaryImage =
  async (
    buffer: Buffer,

    options?: {
      folder?: string;

      fileName?: string;

      retries?: number;
    }
  ): Promise<CloudinaryUploadResult> => {
    const folder =
      options?.folder || "mahfil";

    const retries =
      options?.retries || 3;

    const fileName =
      options?.fileName;

    const upload =
      (
        triesLeft: number
      ): Promise<CloudinaryUploadResult> => {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            logger.info(
              {
                retriesLeft:
                  triesLeft,
              },

              "☁️ Cloudinary upload started"
            );

            const uploadStream =
              cloudinary.uploader.upload_stream(
                {
                  folder,

                  resource_type:
                    "image",

                  format:
                    "png",

                  public_id:
                    fileName,

                  timeout:
                    60000,
                },

                (
                  error,

                  result
                ) => {
                  // ======================
                  // ERROR
                  // ======================

                  if (
                    error
                  ) {
                    logger.error(
                      {
                        error:
                          error.message,

                        triesLeft,
                      },

                      "❌ Cloudinary upload failed"
                    );

                    if (
                      triesLeft > 1
                    ) {
                      logger.info(
                        {},
                        "🔁 Retrying upload"
                      );

                      return setTimeout(
                        async () => {
                          try {
                            const retryResult =
                              await upload(
                                triesLeft - 1
                              );

                            resolve(
                              retryResult
                            );
                          } catch (
                            retryError
                          ) {
                            reject(
                              retryError
                            );
                          }
                        },

                        2000
                      );
                    }

                    return reject(
                      error
                    );
                  }

                  // ======================
                  // SAFETY
                  // ======================

                  if (
                    !result
                  ) {
                    return reject(
                      new Error(
                        "Cloudinary upload returned empty result"
                      )
                    );
                  }

                  logger.info(
                    {
                      secureUrl:
                        result.secure_url,

                      publicId:
                        result.public_id,
                    },

                    "✅ Cloudinary upload success"
                  );

                  // ======================
                  // SUCCESS
                  // ======================

                  resolve({
                    secureUrl:
                      result.secure_url,

                    publicId:
                      result.public_id,

                    width:
                      result.width,

                    height:
                      result.height,

                    bytes:
                      result.bytes,
                  });
                }
              );

            Readable
              .from(buffer)
              .pipe(uploadStream);
          }
        );
      };

    return upload(
      retries
    );
  };
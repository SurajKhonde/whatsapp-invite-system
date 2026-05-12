import fs from "fs/promises";
import path from "path";

import { logger } from "@core/logger/logger";

import {
  renderHtmlToPng,
} from "@utils/renderHtmlToPng";

export async function generateFinalInviteImage(
  payload: {
    category: string;

    htmlTemplateName: string;

    templateParams: Record<
      string,
      string
    >;
  }
) {
  try {
    // =====================================
    // LOAD HTML TEMPLATE
    // =====================================

    const htmlPath = path.join(
      process.cwd(),
      "src/HTML-template",
      payload.category,
      `${payload.htmlTemplateName}.html`
    );

    let html =
      await fs.readFile(
        htmlPath,
        "utf-8"
      );

    // =====================================
    // REPLACE PLACEHOLDERS
    // =====================================

    for (const key in payload.templateParams) {
      const value =
        payload.templateParams[key];

      html = html.replace(
  new RegExp(`{{${key}}}`, "g"),
  value
);
    }

    // =====================================
    // GENERATE FINAL PNG
    // =====================================

    const imageBuffer =
      await renderHtmlToPng(html, {
        width: 800,
        height: 1100,
      });

    // =====================================
    // UPLOAD TO CLOUDINARY
    // =====================================

    const imageUrl =
      await uploadBufferToCloudinary(
        imageBuffer,
        `final-${Date.now()}`
      );

    logger.info(
      { imageUrl },
      "✅ Final invite image generated"
    );

    return {
      imageUrl,
    };
  } catch (error) {
    logger.error(
      { error },
      "❌ Final image generation failed"
    );

    throw error;
  }
}

/**
 * =====================================
 * CLOUDINARY UPLOAD
 * =====================================
 */

async function uploadBufferToCloudinary(
  buffer: Buffer,
  publicId: string
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const cloudinary =
        require("cloudinary").v2;

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            public_id: publicId,

            folder:
              "invites/final",

            resource_type:
              "image",

            format: "png",

            overwrite: true,
          },

          (
            error: any,
            result: any
          ) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(
              result.secure_url
            );
          }
        );

      const {
        Readable,
      } = require("stream");

      Readable.from(buffer).pipe(
        uploadStream
      );
    }
  );
}

import * as fs from "fs/promises";
import * as path from "path";
import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { eq }from "drizzle-orm";
import { logger } from "@core/logger/logger";

import {renderHtmlToMultipleSizes} from "@utils/renderHtmlToPng";

import {
  TemplatePreviewJob,
  imageGenerationQueue,
} from "@core/queue/image-generation.queue";

const PREVIEW_DIMENSIONS = {
  thumbnail: {
    width: 400,
    height: 600,
  },

  fullCard: {
    width: 800,
    height: 1100,
  },
};

export class ImageGenerationService {
  /**
   * ============================================
   * REGISTER TEMPLATE
   * ============================================
   */

  async registerImageTemplate(
    payload: {
      title: string;
      category: string;
      htmlTemplateName: string;
      placeholders: string[];
    }
  ) {
    try {
      logger.info(
        payload,
        "🚀 Register image template"
      );

      const [createdTemplate] =
        await db
          .insert(templates)
          .values({
            title: payload.title,

            category:
              payload.category,

            type: "image",

            htmlTemplateName:
              payload.htmlTemplateName,

            placeholders:
              payload.placeholders,

            isActive: true,

            whatsappStatus:
              "APPROVED",
          })
          .returning();

      // ======================================
      // ADD QUEUE JOB
      // ======================================

      await imageGenerationQueue.add(
        "generate-template-preview",

        {
          jobType:
            "template-preview",

          templateId:
            createdTemplate.id,

          htmlTemplateName:
            payload.htmlTemplateName,

          category:
            payload.category,
        }
      );

      return {
        templateId:
          createdTemplate.id,

        status:
          "processing",

        message:
          "Template queued successfully",
      };
    } catch (error) {
      logger.error(
        { error },
        "❌ Register image template failed"
      );

      throw error;
    }
  }

  /**
   * ============================================
   * GENERATE IMAGES
   * ============================================
   */

  async generatePreviewImages(
    payload: TemplatePreviewJob
  ) {
    try {
      logger.info(
        payload,
        "🎨 Start image generation"
      );

      // ======================================
      // LOAD HTML FILE
      // ======================================

      const htmlFilePath =
        path.join(
          process.cwd(),

          "src/HTML-template",

          payload.category,

          `${payload.htmlTemplateName}.html`
        );

      const htmlContent =
        await fs.readFile(
          htmlFilePath,
          "utf-8"
        );

      // ======================================
      // CHECK CLOUDINARY
      // ======================================

      const exists =
        await this.checkCloudinaryExists(
          payload.htmlTemplateName
        );

      if (exists) {
        logger.info(
          {},
          "☁️ Already exists in Cloudinary"
        );

        const urls =
          await this.getCloudinaryUrls(
            payload.htmlTemplateName
          );

        await this.updateTemplateUrls(
          payload.templateId,

          urls.thumbnail,

          urls.fullCard
        );

        return {
          previewImageUrl:
            urls.thumbnail,

          previewImageUrlFull:
            urls.fullCard,
        };
      }

      // ======================================
      // GENERATE PNG
      // ======================================

      const [
        thumbnailBuffer,

        fullCardBuffer,
      ] =
        await renderHtmlToMultipleSizes(
          htmlContent,

          [
            PREVIEW_DIMENSIONS.thumbnail,

            PREVIEW_DIMENSIONS.fullCard,
          ]
        );

      // ======================================
      // CLOUDINARY UPLOAD
      // ======================================

      const thumbnailUrl =
        await this.uploadToCloudinary(
          thumbnailBuffer,

          `invites/previews/${payload.htmlTemplateName}-thumbnail`
        );

      const fullCardUrl =
        await this.uploadToCloudinary(
          fullCardBuffer,

          `invites/previews/${payload.htmlTemplateName}-fullcard`
        );

      await this.updateTemplateUrls(
        payload.templateId,

        thumbnailUrl,

        fullCardUrl
      );

      return {
        previewImageUrl:
          thumbnailUrl,

        previewImageUrlFull:
          fullCardUrl,
      };
    } catch (error) {
      logger.error(
        { error },
        "❌ Image generation failed"
      );

      throw error;
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private async checkCloudinaryExists(
    htmlTemplateName: string
  ) {
    try {
      const cloudinary =
        require("cloudinary").v2;

      await cloudinary.api.resource(
        `invites/previews/${htmlTemplateName}-thumbnail`
      );

      return true;
    } catch {
      return false;
    }
  }

  private async getCloudinaryUrls(
    htmlTemplateName: string
  ) {
    const cloudinary =
      require("cloudinary").v2;

    const thumbnail =
      await cloudinary.api.resource(
        `invites/previews/${htmlTemplateName}-thumbnail`
      );

    const fullCard =
      await cloudinary.api.resource(
        `invites/previews/${htmlTemplateName}-fullcard`
      );

    return {
      thumbnail:
        thumbnail.secure_url,

      fullCard:
        fullCard.secure_url,
    };
  }

  private async uploadToCloudinary(
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
              public_id:
                publicId,

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

        const { Readable } =
          require("stream");

        Readable.from(
          buffer
        ).pipe(uploadStream);
      }
    );
  }

  private async updateTemplateUrls(
    templateId: string,

    thumbnailUrl: string,

    fullCardUrl: string
  ) {
    await db
      .update(templates)
      .set({
        previewImageUrl:
          thumbnailUrl,

        previewImageUrlFull:
          fullCardUrl,

        hasImage: true,

        updatedAt: new Date(),
      })
      .where(
        eq(
          templates.id,
          templateId
        )
      );
  }
}

export const imageGenerationService =
  new ImageGenerationService();
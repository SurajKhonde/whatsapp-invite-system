import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { eq } from "drizzle-orm";
import { AppError } from "@core/errors/AppError";
import { logger } from "@core/logger/logger";

export class WhatsappTemplateService {
  /**
   * Get all available WhatsApp templates (APPROVED only)
   */
  async getAllTemplates() {
    try {
      const approvedTemplates = await db
        .select()
        .from(templates)
        .where(eq(templates.whatsappStatus, "APPROVED"));

      return {
        message: "Templates fetched",
        data: approvedTemplates,
        notify: false,
      };
    } catch (error) {
      logger.error({ error }, "Error fetching WhatsApp templates");
      throw new AppError("Failed to fetch templates", 500);
    }
  }

  /**
   * Get single template by ID
   */
  async getTemplate(templateId: string) {
    try {
      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, templateId));

      if (!template) {
        throw new AppError("Template not found", 404);
      }

      // Ensure template is WhatsApp approved
      if (template.whatsappStatus !== "APPROVED") {
        throw new AppError(
          `Template not approved for WhatsApp (Status: ${template.whatsappStatus})`,
          403
        );
      }

      return {
        message: "Template fetched",
        data: template,
        notify: false,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ templateId, error }, "Error fetching template");
      throw new AppError("Failed to fetch template", 500);
    }
  }

  /**
   * Get template by WhatsApp template name
   * Example: "wedding_classic_en"
   * 
   * NEW: Uses templateName field from universal schema
   */
  async getTemplateByName(templateName: string) {
    try {
      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.templateName, templateName));

      if (!template) {
        throw new AppError(
          `Template "${templateName}" not found in database`,
          404
        );
      }

      // Ensure template is approved for WhatsApp
      if (template.whatsappStatus !== "APPROVED") {
        throw new AppError(
          `Template not approved for WhatsApp (Status: ${template.whatsappStatus})`,
          403
        );
      }

      return template;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error({ templateName, error }, "Error fetching template by name");
      throw error;
    }
  }

  /**
   * Get template by WhatsApp template ID (official Meta ID)
   * Used to verify template exists on WhatsApp
   */
  async getTemplateByWhatsappId(whatsappTemplateId: string) {
    try {
      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.whatsappTemplateId, whatsappTemplateId));

      if (!template) {
        throw new AppError(
          `WhatsApp template ID "${whatsappTemplateId}" not found`,
          404
        );
      }

      return template;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(
        { whatsappTemplateId, error },
        "Error fetching template by WhatsApp ID"
      );
      throw error;
    }
  }

  /**
   * Create or update template with WhatsApp details
   * Called when admin approves a template for WhatsApp
   */
  async updateWhatsappTemplate(templateId: string, payload: {
    whatsappTemplateId?: string;
    whatsappStatus?: "APPROVED" | "PENDING" | "REJECTED";
    whatsappApprovedAt?: Date;
    whatsappRejectionReason?: string | null;
  }) {
    try {
      const [updatedTemplate] = await db
        .update(templates)
        .set({
          ...payload,
          updatedAt: new Date(),
        })
        .where(eq(templates.id, templateId))
        .returning();

      logger.info(
        { templateId, status: payload.whatsappStatus },
        "WhatsApp template updated"
      );

      return updatedTemplate;
    } catch (error) {
      logger.error(
        { templateId, error },
        "Error updating WhatsApp template"
      );
      throw new AppError("Failed to update template", 500);
    }
  }

  /**
   * Get template parameters for WhatsApp message sending
   * Returns array format: [{index: 1, key: "name", label: "Guest Name"}, ...]
   */
  async getTemplateParameters(templateId: string) {
    try {
      const template = await this.getTemplate(templateId);
      
      // Parameters are stored as JSONB array
      const parameters = template.data.parameters as Array<{
        index: number;
        key: string;
        label: string;
      }> | null;

      return parameters || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get WhatsApp parameters (type mappings)
   * Example: [{index: 1, type: "text"}, {index: 2, type: "text"}, ...]
   */
  async getWhatsappParameters(templateId: string) {
    try {
      const template = await this.getTemplate(templateId);
      
      // whatsappParameters stored as JSONB array
      const whatsappParams = template.data.whatsappParameters as Array<{
        index: number;
        type: string;
      }> | null;

      return whatsappParams || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate if all required template parameters are provided
   * 
   * NEW: Uses parameters field from universal schema
   */
  validateParameters(
    template: any,
    providedParams: Record<string, string>
  ): { valid: boolean; missingFields: string[] } {
    const parameters = template.parameters as Array<{
      index: number;
      key: string;
      label: string;
    }> | null;

    if (!parameters || parameters.length === 0) {
      return { valid: true, missingFields: [] };
    }

    const missingFields: string[] = [];

    for (const param of parameters) {
      if (!providedParams[param.key]) {
        missingFields.push(param.key);
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Get template body for message
   * NEW: Uses templateBody field from universal schema
   */
  getTemplateBody(template: any): string {
    return template.templateBody || "";
  }

  /**
   * Get header text (if available)
   */
  getHeaderText(template: any): string | null {
    return template.headerText || null;
  }

  /**
   * Get footer text (if available)
   */
  getFooterText(template: any): string | null {
    return template.footerText || null;
  }

  /**
   * Check if template has image
   */
  hasImage(template: any): boolean {
    return template.hasImage === true;
  }

  /**
   * Get image position (header or footer)
   */
  getImagePosition(template: any): string | null {
    return template.imagePosition || null;
  }
}

export const whatsappTemplateService = new WhatsappTemplateService();
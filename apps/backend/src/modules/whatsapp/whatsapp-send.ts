import axios from "axios";
import { logger } from "@core/logger/logger";
import { whatsappTemplateService } from "./whatsapp-templates.service";
import { AppError } from "@core/errors/AppError";

const TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const BASE_URL = "https://graph.facebook.com/v21.0";

export interface SendWhatsAppPayload {
  to: string;
  templateId: string; // Database template ID (UUID)
  templateParams: Record<string, string>;
  imageUrl?: string;
}

/**
 * Send WhatsApp message using PRE-APPROVED TEMPLATE from universal schema
 * 
 * Flow:
 * 1. Get template from database (universal templates table)
 * 2. Validate all parameters are provided
 * 3. Build parameter array matching {{1}}, {{2}}, etc.
 * 4. Call WhatsApp API with template name and parameters
 * 
 * Template fields used:
 * - whatsappTemplateId: Official Meta template ID
 * - templateName: Template name (e.g., "wedding_classic_en")
 * - templateBody: Message template with {{1}}, {{2}} placeholders
 * - parameters: Array of {index, key, label} for parameter mapping
 * - headerText: Optional header text
 * - footerText: Optional footer text
 * - hasImage: Whether template has image
 * - imagePosition: "header" or "footer"
 * - whatsappLanguageCode: Language code
 * - whatsappCategory: "MARKETING" or "TRANSACTIONAL"
 */
export const sendWhatsAppTemplate = async (
  payload: SendWhatsAppPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const { to, templateId, templateParams, imageUrl } = payload;

  try {
    logger.info(
      { to, templateId, hasImage: !!imageUrl },
      "Fetching template for WhatsApp send"
    );

    // 1. Get template from database
    const templateResponse = await whatsappTemplateService.getTemplate(
      templateId
    );
    const template = templateResponse.data;

    // 2. Validate all parameters are provided
    const validation = whatsappTemplateService.validateParameters(
      template,
      templateParams
    );

    if (!validation.valid) {
      logger.warn(
        { templateId, missingFields: validation.missingFields },
        "Missing required template parameters"
      );

      return {
        success: false,
        error: `Missing required parameters: ${validation.missingFields.join(", ")}`,
      };
    }

    // 3. Build parameters array in correct order
    // Parameters field format: [{index: 1, key: "name", label: "Guest Name"}, ...]
    // We need to map these to the order WhatsApp expects
    const parameters = template.parameters as Array<{
      index: number;
      key: string;
      label: string;
    }> | null;

    const parameterArray: any[] = [];

    if (parameters && parameters.length > 0) {
      // Sort by index to ensure correct order
      const sortedParams = [...parameters].sort((a, b) => a.index - b.index);

      for (const param of sortedParams) {
        const value = templateParams[param.key];
        if (value) {
          parameterArray.push({
            type: "text",
            text: value,
          });
        }
      }
    }

    logger.info(
      { templateId, paramCount: parameterArray.length },
      "Built parameter array"
    );

    // 4. Build WhatsApp API request
    const requestBody: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace(/\D/g, ""), // Remove non-digits, ensure valid phone
      type: "template",
      template: {
        name: template.templateName, // e.g., "wedding_classic_en"
        language: {
          code: template.whatsappLanguageCode || "en",
        },
        components: [
          {
            type: "body",
            parameters: parameterArray,
          },
        ],
      },
    };

    // Add header if template has header text or image
    if (template.headerText || (template.hasImage && imageUrl)) {
      const headerComponents: any = {
        type: "header",
        parameters: [],
      };

      // Add image header if available
      if (template.hasImage && imageUrl && template.imagePosition === "header") {
        headerComponents.parameters.push({
          type: "image",
          image: {
            link: imageUrl,
          },
        });
      }

      if (headerComponents.parameters.length > 0) {
        requestBody.template.components.unshift(headerComponents);
      }
    }

    // Add footer if template has footer text
    if (template.footerText) {
      requestBody.template.components.push({
        type: "footer",
        parameters: [], // Footer typically has no parameters in WhatsApp
      });
    }

    logger.debug(
      { templateName: template.templateName, to },
      "Built WhatsApp request body"
    );

    // 5. Call WhatsApp API
    const response = await axios.post(
      `${BASE_URL}/${PHONE_ID}/messages`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const messageId = response.data.messages?.[0]?.id;
    const waMessageId = response.data.messages?.[0]?.message_status?.id;

    logger.info(
      {
        to,
        templateName: template.templateName,
        templateId,
        messageId: messageId || waMessageId,
      },
      "✅ WhatsApp message sent successfully"
    );

    return {
      success: true,
      messageId: messageId || waMessageId,
    };
  } catch (error: any) {
    // Handle different error types
    if (error instanceof AppError) {
      logger.warn(
        { templateId, error: error.message },
        "Template validation error"
      );

      return {
        success: false,
        error: error.message,
      };
    }

    const errorMessage =
      error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.data?.error?.code;

    // Common WhatsApp API errors
    if (errorCode === 131000) {
      logger.error(
        { templateId, to },
        "Message throttled - recipient limit reached"
      );

      return {
        success: false,
        error: "Message throttled. Please try again later.",
      };
    }

    if (errorCode === 131004) {
      logger.error(
        { templateId, to },
        "Message sent within 24 hour window with invalid formatting"
      );

      return {
        success: false,
        error: "Invalid message format or recipient not in 24-hour window.",
      };
    }

    logger.error(
      {
        templateId,
        to,
        errorCode,
        errorMessage,
        details: error.response?.data?.error,
      },
      "❌ WhatsApp API error"
    );

    return {
      success: false,
      error: errorMessage || "Failed to send WhatsApp message",
    };
  }
};

/**
 * Send template preview (for testing)
 * Returns formatted message without actually sending
 */
export const previewWhatsAppTemplate = async (
  templateId: string,
  templateParams: Record<string, string>
): Promise<{
  success: boolean;
  preview?: string;
  error?: string;
}> => {
  try {
    const templateResponse = await whatsappTemplateService.getTemplate(
      templateId
    );
    const template = templateResponse.data;

    // Validate parameters
    const validation = whatsappTemplateService.validateParameters(
      template,
      templateParams
    );

    if (!validation.valid) {
      return {
        success: false,
        error: `Missing parameters: ${validation.missingFields.join(", ")}`,
      };
    }

    // Replace placeholders with actual values
    let preview = template.templateBody || "";
    const parameters = template.parameters as Array<{
      index: number;
      key: string;
      label: string;
    }> | null;

    if (parameters) {
      const sortedParams = [...parameters].sort((a, b) => a.index - b.index);
      sortedParams.forEach((param) => {
        const value = templateParams[param.key];
        if (value) {
          preview = preview.replace(`{{${param.index}}}`, value);
        }
      });
    }

    return {
      success: true,
      preview,
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof AppError ? error.message : error.message;

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Validate template before sending
 * Checks if all parameters are provided and template is approved
 */
export const validateTemplateBeforeSending = async (
  templateId: string,
  templateParams: Record<string, string>,
  phoneNumber: string
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Validate template exists and is approved
    const templateResponse = await whatsappTemplateService.getTemplate(
      templateId
    );
    const template = templateResponse.data;

    if (template.whatsappStatus !== "APPROVED") {
      errors.push(`Template status is ${template.whatsappStatus}, not APPROVED`);
    }

    // 2. Validate parameters
    const validation = whatsappTemplateService.validateParameters(
      template,
      templateParams
    );

    if (!validation.valid) {
      errors.push(
        `Missing parameters: ${validation.missingFields.join(", ")}`
      );
    }

    // 3. Validate phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      errors.push("Invalid phone number");
    }

    // 4. Warnings
    if (!template.isActive) {
      warnings.push("Template is inactive");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error: any) {
    return {
      valid: false,
      errors: [error.message || "Template validation failed"],
      warnings: [],
    };
  }
};
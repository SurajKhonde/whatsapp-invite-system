import axios from "axios";
import { logger } from "@core/logger/logger";

const TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const BASE_URL = "https://graph.instagram.com/v18.0";

export interface SendWhatsAppPayload {
  to: string;
  templateName: string;
  templateParams: Record<string, string>;
  imageUrl?: string;
  messageType?: "text_only" | "image_only" | "image_and_text";
}

/**
 * Send WhatsApp message with PRE-APPROVED TEMPLATE
 * Template name like: "wedding_classic_en"
 * Parameters: { guestName: "Raj", groomName: "Raj Kumar", brideName: "Priya", eventDate: "15 May", venue: "Grand Hotel" }
 * WhatsApp API replaces {{1}}, {{2}}, etc. with the parameters
 */
export const sendWhatsAppTemplate = async (
  payload: SendWhatsAppPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const { to, templateName, templateParams, imageUrl, messageType } = payload;

  try {
    logger.info(
      { to, templateName, hasImage: !!imageUrl },
      "Sending WhatsApp template"
    );

    // Build parameters array for WhatsApp API
    // Parameters are sent as an array: [param1, param2, param3, ...]
    // They will replace {{1}}, {{2}}, {{3}}, etc. in the template
    const parameters: any[] = [
      { type: "text", text: templateParams.guestName || "" },
      { type: "text", text: templateParams.groomName || templateParams.celebrantName || templateParams.eventName || "" },
      { type: "text", text: templateParams.brideName || "" },
      { type: "text", text: templateParams.eventDate || "" },
      { type: "text", text: templateParams.venueName || "" },
      { type: "text", text: templateParams.venueAddress || templateParams.location || templateParams.schoolName || "" },
    ].filter((p) => p.text !== ""); // Remove empty parameters

    // Build WhatsApp API request
    const requestBody: any = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""), // Remove non-digits
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters,
          },
        ],
      },
    };

    // Add image header if present and messageType includes image
    if (imageUrl && (messageType === "image_only" || messageType === "image_and_text")) {
      requestBody.template.components.unshift({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: imageUrl,
            },
          },
        ],
      });
    }

    // Call WhatsApp API
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

    logger.info(
      { to, templateName, messageId },
      "WhatsApp message sent successfully"
    );

    return {
      success: true,
      messageId,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.data?.error?.code;

    logger.error(
      {
        to,
        templateName,
        errorCode,
        errorMessage,
        details: error.response?.data,
      },
      "WhatsApp API error"
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
};
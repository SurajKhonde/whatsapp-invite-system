import axios from "axios";
import { SendTemplatePayload } from "./whatsapp.types";

const TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const BASE_URL = process.env.WHATSAPP_API_URL;

// export const sendWhatsAppTemplate = async (
//   payload: SendTemplatePayload
// ) => {
//   const { to, name, templateName } = payload;

//   try {
//     const response = await axios.post(
//       `${BASE_URL}/${PHONE_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to,
//         type: "template",
//         template: {
//           name: templateName,
//           language: { code: "en" },
//           components: [
//             {
//               type: "body",
//               parameters: [
//       { type: "text", text: name },          // {{1}}
//       { type: "text", text: "10 May" },      // {{2}}
//       { type: "text", text: "7 PM" },        // {{3}}
//       { type: "text", text: "Bangalore" },   // {{4}}
//     ],
//             },
//           ],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       success: true,
//       messageId: response.data.messages?.[0]?.id,
//     };
//   } catch (error: any) {
//     console.error("WhatsApp Error:", error.response?.data || error.message);

//     return {
//       success: false,
//       error: error.response?.data || error.message,
//     };
//   }
// };

export const sendWhatsAppTemplate = async (payload: SendTemplatePayload) => {
  const { to } = payload;

  try {
    const response = await axios.post(
      `${BASE_URL}/${PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        language: { code: "en_US" },
        to,
        type: "text",
        text: {
           body: "Hello from Suraj 👋 We launched our WhatsApp invite system (Mehfil). This is a test message. Please check out my app 🚀",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", response.data);

    return {
      success: true,
      messageId: response.data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("WhatsApp Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};
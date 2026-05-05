import path from "path";
import fs from "fs";
import { renderTemplate } from "@utils/templateEngine";
import { generateImage } from "@utils/generateImage";
import { saveLocalImage } from "@utils/saveLocalImage";
import {saveCloudinaryImage} from "@utils/saveCloudinaryImage"
import { InviteTemplateData, PreviewInviteDTO } from "./invite.types";
import { templateRegistry } from "@config/templateRegistry";
export class InviteService {
  private getTemplatePath(templateName: string): string {
  const relativePath = templateRegistry[templateName];
  if (!relativePath) {
    throw new Error(`Template "${templateName}" not found in registry`);
  }
  const templatePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at path: ${templatePath}`);
  }
  return templatePath;
}
  private buildTemplateData(data: PreviewInviteDTO): InviteTemplateData {
    const templateData = {
      groomName: data.groomName,
      brideName: data.brideName,
      day: data.day,
      monthYear: data.monthYear,
      venueName: data.venueName,
      venueAddress: data.venueAddress,
    };
    return templateData;
  }

  async generateAndSave(data: PreviewInviteDTO) {
    const templatePath = this.getTemplatePath(data.templateName);
    const templateData = this.buildTemplateData(data);
    const html = renderTemplate(templatePath, templateData);
    const buffer = await generateImage(html);
    const imageUrl = await saveCloudinaryImage(buffer);
 
    return {
      message: "Invite generated successfully",
      data: { imageUrl }, 
      notify: true,
    };
  }
}
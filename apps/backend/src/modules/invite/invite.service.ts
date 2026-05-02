import path from "path";
import fs from "fs";
import { renderTemplate } from "@utils/templateEngine";
import { generateImage } from "@utils/generateImage";
import { saveLocalImage } from "@utils/saveLocalImage";
import {
  InviteTemplateData,
  PreviewInviteDTO,
} from "./invite.types";

export class InviteService {
  private getTemplatePath(): string {
    const templatePath = path.join(
      process.cwd(),
      "src/template/birthday/birthday-premium.html"
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error("Template file not found");
    }

    return templatePath;
  }

  private buildTemplateData(data: PreviewInviteDTO): InviteTemplateData {
    const basePath = path.join(process.cwd(), "src/public/birthday");

    const toFileUrl = (file: string) => {
      const fullPath = path.join(basePath, file);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`Asset not found: ${file}`);
      }

      return `${fullPath}`;
    };

    return {
      ...data,
      bgImage: toFileUrl("birthdaynew.jpeg"),
      ribbonImage: toFileUrl("ribban.png"),
      balloonImage: toFileUrl("baloonImageFive.png"),
      candleImage: toFileUrl("candle.jpeg"),
    };
  }

  async generateAndSave(data: PreviewInviteDTO) {
    const html = renderTemplate(
      this.getTemplatePath(),
      this.buildTemplateData(data)
    );

    const debugPath = path.join(process.cwd(), "debug.html");
    fs.writeFileSync(debugPath, html);

    const buffer = await generateImage(html);

    const fileName = saveLocalImage(buffer);

    const imageUrl = `/generated/${fileName}`;

    return {
      message: "Invite generated successfully",
      data: { imageUrl },
      notify: true,
    };
  }
}
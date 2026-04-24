// src/utils/templateEngine.ts

import fs from "fs";

export const renderTemplate = (
  filePath: string,
  data: Record<string, string>
) => {
  let html = fs.readFileSync(filePath, "utf-8");

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, data[key]);
  });

  return html;
};
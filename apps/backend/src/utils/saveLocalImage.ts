// src/utils/saveLocalImage.ts

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const saveLocalImage = (buffer: Buffer): string => {
  const fileName = `invite-${uuid()}.png`;

  const dir = path.join(process.cwd(), "src/public/generated");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, buffer);

  return fileName; // ✅ only filename
};
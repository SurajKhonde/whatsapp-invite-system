import crypto from "crypto";

// 🔐 CONFIG
const algorithm = "aes-256-cbc";
const SECRET_KEY = process.env.ENCRYPTION_KEY as string;
const key = crypto.createHash("sha256").update(SECRET_KEY).digest();

// =======================================================
// 🔒 ENCRYPT
// =======================================================
export const encrypt = (plainText: string): string => {
  const iv = crypto.randomBytes(16); // unique per encryption

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(":");

  if (!ivHex || !encrypted) {
    throw new Error("Invalid encrypted format");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const maskPhone = (phone: string): string => {
  if (phone.length < 6) return phone;

  return phone.slice(0, 3) + "*****" + phone.slice(-2);
};
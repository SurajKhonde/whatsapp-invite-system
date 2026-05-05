import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // ✅ 60 seconds timeout
});

export const saveCloudinaryImage = (
  buffer: Buffer,
  retries = 3
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const attempt = (triesLeft: number) => {
      console.log(`Cloudinary upload attempt... (${4 - triesLeft}/3)`);

      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "invites",
          resource_type: "image",
          format: "png",
          timeout: 60000, // ✅ also set per-request
        },
        (error, result) => {
          if (error) {
            console.error(`Cloudinary attempt failed:`, error.message);

            if (triesLeft > 1) {
              console.log(`Retrying... ${triesLeft - 1} attempts left`);
              setTimeout(() => attempt(triesLeft - 1), 2000); // wait 2s before retry
            } else {
              console.error("All Cloudinary attempts exhausted");
              reject(error);
            }
            return;
          }

          console.log("Cloudinary upload OK:", result?.secure_url);
          resolve(result!.secure_url);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    };

    attempt(retries);
  });
};
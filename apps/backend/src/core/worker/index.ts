import { logger } from "@core/logger/logger";

import "./emailOTP.worker";
import "./invite.worker";
import "./imagegeneration.worker"
import "./template-render.worker";
import "./cloudinary-upload.worker";
import "./template-finalize.worker";


logger.info("🚀 All workers started");
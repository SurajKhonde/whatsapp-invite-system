import { asyncHandler } from "@core/middleware/asyncHandler";
import { verifyOtpService } from "./emailOTP.service";

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;

  const result = await verifyOtpService({
    email,
    otp: Number(otp),
    purpose,
  });

  res.json({
    success: true,
    ...result,
  });
});
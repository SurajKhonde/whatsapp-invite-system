export const getOtpTemplate = ({
  otp,
  purpose,
}: {
  otp: number;
  purpose: string;
}) => {
  const baseTemplate = (title: string, subtitle: string) => ({
    subject: title,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <h1 style="color: #6b46c1; margin-bottom: 10px;">Mahfil</h1>
        
        <h2 style="margin: 10px 0;">${title}</h2>
        <p style="color: #555; font-size: 14px;">
          ${subtitle}
        </p>

        <div style="margin: 25px 0;">
          <span style="
            display: inline-block;
            background: #f3f0ff;
            color: #6b46c1;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            padding: 12px 24px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #777; font-size: 13px;">
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>

      <p style="text-align:center; font-size: 12px; color: #999; margin-top: 15px;">
        © ${new Date().getFullYear()} Mahfil. All rights reserved.
      </p>
    </div>
    `,
  });

  if (purpose === "signup") {
    return baseTemplate(
      "Verify your account",
      "Welcome to Mahfil 🎉 Use the OTP below to complete your signup."
    );
  }

  if (purpose === "forgot-password") {
    return baseTemplate(
      "Reset your password",
      "Use the OTP below to reset your password securely."
    );
  }

  throw new Error("Invalid OTP purpose");
};
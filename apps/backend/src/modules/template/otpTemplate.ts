export const getOtpTemplate = ({
  otp,
  purpose,
}: {
  otp: number;
  purpose: string;
}) => {
  if (purpose === "signup") {
    return {
      subject: "Verify your account",
      html: `
        <h2>Welcome 🎉</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    };
  }

  if (purpose === "forgot-password") {
    return {
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    };
  }

  throw new Error("Invalid OTP purpose");
};
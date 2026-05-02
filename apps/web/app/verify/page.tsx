"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/store/apiSlice";
type Purpose = "signup" | "forgot-password";
export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose") as Purpose;
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] =
    useResendOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(40);
const [resendCount, setResendCount] = useState(true);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
useEffect(() => {
  inputsRef.current[0]?.focus();
}, []);
  // ⏱️ TIMER
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  useEffect(() => {
  const finalOtp = otp.join("");
  if (finalOtp.length === 6 && !isLoading) {
    handleVerify();
  }
}, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };
const resetOtpState = () => {
  setOtp(["", "", "", "", "", ""]);
  inputsRef.current[0]?.focus();
};
  // ⬅️ BACKSPACE + ENTER
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  // ✅ VERIFY OTP
const handleVerify = async () => {
  const finalOtp = otp.join("");

  if (finalOtp.length < 6) {
    setError(true);
    return;
  }

try {
  await verifyOtp({
    email: email!,
    otp: finalOtp,
    purpose: purpose,
  }).unwrap();

  setIsVerified(true);
  resetOtpState();

  setTimeout(() => {
    if (purpose === "signup") {
      router.replace("/dashboard");
    } else if (purpose === "forgot-password") {
      router.replace(`/reset-new-password?email=${email}`);
    }
  }, 1000);

} catch (err) {
  setError(true);
  resetOtpState();
}
};

  // 🔁 RESEND OTP
const handleResend = async () => {
  try {
    const res = await resendOtp({  email: email! , purpose:purpose }).unwrap();

    // ✅ success case
    setResendCount(true);
    resetOtpState();
    setTimer(40);

  } catch (err: any) {
    console.log(err);
    if (err?.status === 429) {
      setResendCount(false); 
    }
  }
};
const handleSkip = () => {
  router.replace("/dashboard");
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100">
      <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-[380px] text-center">
        
        {/* ✅ SUCCESS */}
        {isVerified ? (
          <div className="text-green-600 font-semibold text-lg">
            ✅ OTP Verified! Redirecting...
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              Verify OTP
            </h2>

            <p className="text-gray-600 mb-6 text-sm">
              Sent to {email}
            </p>

            {/* OTP INPUT */}
            <div className="flex justify-between mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                 ref={(el) => {inputsRef.current[i] = el;}}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, i)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, i)
                  }
                  
                  className={`w-12 h-12 text-center text-lg font-bold text-black rounded-lg border  
                  ${
                    error ? "border-red-500" : "border-gray-300"
                  } 
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none`}
                />
              ))}
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm mb-4">
                Invalid OTP
              </p>
            )}

            {/* VERIFY BUTTON */}
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-lg shadow"
            >
              {isLoading ? "Verifying..." : "Verify 🚀"}
            </button>

            {/* RESEND */}
          <div className="mt-4 text-sm">
  {timer > 0 ? (
    <p className="text-gray-500">
      Resend OTP in {timer}s
    </p>
  ) : resendCount  ? (
    <button
      onClick={handleResend}
      disabled={resendLoading}
      className="text-pink-600 hover:underline"
    >
      {resendLoading ? "Sending..." : "Resend OTP"}
    </button>
  ) : (
    <div className="space-y-2">
      <p className="text-gray-500 text-sm">
        Not getting OTP?
      </p>

      <button
        onClick={handleSkip}
        className="text-blue-600 font-medium hover:underline"
      >
        Continue Anyway →
      </button>
    </div>
  )}
</div>
          </>
        )}
      </div>
    </div>
  );
}
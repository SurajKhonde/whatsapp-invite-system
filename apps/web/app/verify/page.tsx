"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // 🔢 handle input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ⬅️ backspace handling
const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
) => {
  if (e.key === "Backspace") {
    if (!otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  if (e.key === "Enter") {
    handleVerify();
  }
};

  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      setError(true);
      return;
    }

    console.log("OTP:", finalOtp);

    // call backend

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100">
      
      <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-[380px] text-center">
        
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          Verify OTP
        </h2>

        <p className="text-gray-600 mb-6 text-sm">
          Sent to {email}
        </p>

        {/* 🔢 OTP BOXES */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el: HTMLInputElement | null) => {
  inputsRef.current[i] = el;
}}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-12 h-12 text-center text-lg font-bold rounded-lg border 
              ${error ? "border-red-500" : "border-gray-300"} 
              focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none`}
            />
          ))}
        </div>

        {/* ❌ ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            Enter valid 6-digit OTP
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-lg shadow"
        >
          Verify 🚀
        </button>

        {/* SKIP */}
        <p
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-500 mt-4 cursor-pointer hover:text-pink-600"
        >
          Didn’t get OTP? Continue anyway
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Invalid email");

    try {
      await forgotPassword({ email }).unwrap();

      router.push(
        `/verify?email=${encodeURIComponent(email)}&purpose=reset`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-100 to-pink-200">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[360px] space-y-4 border border-white/30">

        <h2 className="text-2xl font-bold text-center text-pink-600">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Enter your email to receive reset code
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          className="w-full p-3 rounded-lg border border-gray-300 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-black"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 
          text-white rounded-lg shadow hover:scale-105 transition"
        >
          {isLoading ? "Sending..." : "Send Reset Code"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-pink-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
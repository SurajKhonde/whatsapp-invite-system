"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validatePassword = (pass: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleReset = async () => {
    setError("");

    if (!password || !confirm) return setError("All fields are required");
    if (password !== confirm) return setError("Passwords do not match");
    if (!validatePassword(password))
      return setError("Password must be 8+ chars, include uppercase, number & special char");
    if (!email) return setError("Invalid reset link");

    try {
      await resetPassword({ email, password }).unwrap();
      router.push("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-100 to-red-100">
      {/* Card */}
      <div className="relative z-10 w-[380px] p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(255,0,100,0.15)]">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-2">Reset Password</h2>

        <p className="text-center text-gray-500 mb-6 text-sm">Create a new secure password 🔐</p>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="New password"
            className="w-full p-3 rounded-xl bg-white/80 border border-pink-100 
            focus:border-pink-400 focus:ring-2 focus:ring-pink-200 
            outline-none transition placeholder-gray-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="relative mb-5">
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full p-3 rounded-xl bg-white/80 border border-pink-100 
            focus:border-pink-400 focus:ring-2 focus:ring-pink-200 
            outline-none transition placeholder-gray-400 text-black"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-xs text-pink-500 hover:text-pink-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password Hint */}
        <p className="text-xs text-gray-400 mb-4 text-center">
          Must include uppercase, number & special character
        </p>

        {/* Button */}
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white font-medium 
          bg-gradient-to-r from-pink-500 to-red-500 
          hover:from-pink-600 hover:to-red-600
          shadow-lg shadow-pink-200 
          transition transform hover:scale-[1.02]"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Remember your password?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-pink-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Secure password reset powered by encryption 🔐
        </p>
      </div>
    </div>
  );
}

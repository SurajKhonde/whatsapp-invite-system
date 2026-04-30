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

  const validatePassword = (pass: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleReset = async () => {
    setError("");

    if (!password || !confirm) {
      return setError("All fields required");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (!validatePassword(password)) {
      return setError("Weak password");
    }

    try {
      await resetPassword({ email, password }).unwrap();
      router.push("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-100 to-pink-200">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[360px] space-y-4 border border-white/30">

        <h2 className="text-2xl font-bold text-center text-pink-600">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type={show ? "text" : "password"}
          className="w-full p-3 rounded-lg border border-gray-300 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type={show ? "text" : "password"}
          className="w-full p-3 rounded-lg border border-gray-300 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={() => setShow(!show)}
          className="text-xs text-pink-500"
        >
          {show ? "Hide" : "Show"} Password
        </button>

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 
          text-white rounded-lg shadow hover:scale-105 transition"
        >
          {isLoading ? "Resetting..." : "Reset Password 🔐"}
        </button>
      </div>
    </div>
  );
}
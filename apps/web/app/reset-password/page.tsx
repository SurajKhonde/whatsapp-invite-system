"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChangeOldPasswordMutation } from "@/store/apiSlice";
import { getErrorMessage } from "@/lib/errors";

export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [changeOldPassword, { isLoading }] = useChangeOldPasswordMutation();

  const validatePassword = (pass: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleChange = async () => {
    setError("");

    if (!oldPassword || !password || !confirm)
      return setError("All fields are required");

    if (password !== confirm)
      return setError("Passwords do not match");

    if (!validatePassword(password))
      return setError(
        "Password must be 8+ chars, include uppercase, number & special char"
      );

    if (!email) return setError("Invalid request");
    try {
      await changeOldPassword({
        email,
        oldPassword,
        newPassword: password,
      }).unwrap();

      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-100 to-red-100">
      <div className="w-[380px] p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg">

        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Change Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* Old Password */}
        <input
          type={show ? "text" : "password"}
          placeholder="Old password"
          className="w-full p-3 mb-3 rounded-xl border"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type={show ? "text" : "password"}
          placeholder="New password"
          className="w-full p-3 mb-3 rounded-xl border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          className="w-full p-3 mb-3 rounded-xl border"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* Show toggle */}
        <button
          onClick={() => setShow(!show)}
          className="text-sm text-pink-500 mb-4"
        >
          {show ? "Hide" : "Show"} Passwords
        </button>

        {/* Button */}
        <button
          onClick={handleChange}
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-red-500"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Keep your account secure 🔐
        </p>
      </div>
    </div>
  );
}

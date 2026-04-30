"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "Store/apiSlice";

export default function LogoutPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({ feedback }).unwrap();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100">

      {/* Floating shapes */}
      <div className="absolute w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-[250px] h-[250px] bg-purple-300/20 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative z-10 w-[420px] p-8 rounded-3xl 
      bg-white/80 backdrop-blur-xl border border-white/40 
      shadow-[0_20px_70px_rgba(100,0,200,0.15)]">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-purple-600 mb-2">
          See you soon 👋
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Before you go, we'd love to hear your thoughts 💭
        </p>

        {/* Feedback box */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what could be better..."
          className="w-full h-24 p-3 rounded-xl 
          bg-white border border-purple-100 
          focus:border-purple-400 focus:ring-2 focus:ring-purple-200 
          outline-none resize-none text-black mb-5"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-1/2 py-3 rounded-xl border border-gray-300 
            text-gray-600 hover:bg-gray-100 transition"
          >
            Stay
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-1/2 py-3 rounded-xl text-white font-medium 
            bg-gradient-to-r from-purple-500 to-pink-500 
            hover:from-purple-600 hover:to-pink-600
            shadow-lg shadow-purple-200 
            transition transform hover:scale-[1.02]"
          >
            {isLoading ? "Logging out..." : "Logout 🚪"}
          </button>
        </div>

        {/* Footer message */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Thanks for being part of Mehfil ❤️  
          Your moments matter. Come back anytime ✨
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [signup, { isLoading }] = useSignupMutation();

  const [stars, setStars] = useState<
    { left: string; top: string; duration: string }[]
  >([]);

  // 🌟 stars (safe)
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80}%`,
      duration: `${5 + Math.random() * 10}s`,
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(generated);
  }, []);

  // ✅ validations
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleSignup = async () => {
  setError("");

  if (!name || !email || !password) {
    return setError("All fields are required");
  }

  if (!validateEmail(email)) {
    return setError("Invalid email format");
  }

  if (!validatePassword(password)) {
    return setError(
      "Password must be 8+ chars, include uppercase, number & special char"
    );
  }

  try {
    await signup({ name, email, password }).unwrap();
    router.push(`/verify?email=${email}`);
  } catch (err: unknown) {
  setError(getErrorMessage(err));
}
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-red-100 to-pink-200">
      
      {/* 🌟 Stars */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-70 animate-float"
            style={{
              left: star.left,
              top: star.top,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* 💎 Card */}
      <div className="relative z-10 backdrop-blur-lg bg-white/60 p-10 rounded-2xl shadow-xl w-[380px] border border-white/30 space-y-4">
        
        <h2 className="text-3xl font-bold text-center text-pink-600">
          Create Account
        </h2>

        {/* ❌ Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Name */}
        <input
          className="border border-gray-300 bg-white/80 backdrop-blur-sm 
          text-gray-900 placeholder-gray-600 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
          outline-none p-3 w-full rounded-lg transition"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="border border-gray-300 bg-white/80 backdrop-blur-sm 
          text-gray-900 placeholder-gray-600 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
          outline-none p-3 w-full rounded-lg transition"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="border border-gray-300 bg-white/80 backdrop-blur-sm 
            text-gray-900 placeholder-gray-600 
            focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
            outline-none p-3 w-full rounded-lg transition"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-sm text-pink-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-lg shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Account 🚀"}
        </button>
      </div>
    </div>
  );
}
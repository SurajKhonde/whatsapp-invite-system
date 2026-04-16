
"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [stars, setStars] = useState<
    { left: string; delay: string; duration: string }[]
  >([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const generated = Array.from({ length: 25 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 4}s`,
    }));

    setStars(generated);
  }, []);

  const handleLogin = () => {
    console.log(email, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-100 to-red-100">

      {/* 🌠 subtle falling glow */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[12px] bg-pink-400/60 blur-[1px] animate-fall"
            style={{
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* 💎 Glass Card */}
      <div className="relative z-10 w-[380px] p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(255,0,100,0.15)]">

        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to continue your journey ✨
        </p>

        {/* Email */}
        <input
          className="w-full p-3 mb-4 rounded-xl bg-white/80 border border-pink-100 
          focus:border-pink-400 focus:ring-2 focus:ring-pink-200 
          outline-none transition placeholder-gray-400"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative mb-5">
          <input
            type={show ? "text" : "password"}
            className="w-full p-3 rounded-xl bg-white/80 border border-pink-100 
            focus:border-pink-400 focus:ring-2 focus:ring-pink-200 
            outline-none transition placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-xs text-pink-500 hover:text-pink-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl text-white font-medium 
          bg-gradient-to-r from-pink-500 to-red-500 
          hover:from-pink-600 hover:to-red-600
          shadow-lg shadow-pink-200 
          transition transform hover:scale-[1.02]"
        >
          Login 🚀
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Secure login powered by modern encryption 🔐
        </p>
      </div>
    </div>
  );
}
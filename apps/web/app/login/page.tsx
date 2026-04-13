"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [stars, setStars] = useState<
    { left: string; delay: string; duration: string }[]
  >([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  // ✅ Safe random generation
  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(generated);
  }, []);

  const handleLogin = () => {
    console.log(email, password);
    alert("Login logic later");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-red-100 to-pink-200">
      
      {/* 🌠 Stars */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[10px] bg-pink-400 opacity-70 animate-fall blur-[1px]"
            style={{
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* 💎 Card */}
      <div className="relative z-10 backdrop-blur-lg bg-white/60 p-10 rounded-2xl shadow-xl w-[380px] border border-white/30">
        
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">
          Welcome Back ❤️
        </h2>

        {/* Email */}
        <input
          className="border border-gray-300 bg-white/70 backdrop-blur-sm 
          placeholder-gray-400 text-gray-800 
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
          outline-none p-3 w-full mb-4 rounded-lg transition"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={show ? "text" : "password"}
            className="border border-gray-300 bg-white/70 backdrop-blur-sm 
            placeholder-gray-400 text-gray-800 
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

        {/* Button */}
        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-lg shadow-lg hover:scale-105 transition"
        >
          Login 🚀
        </button>
      </div>
    </div>
  );
}
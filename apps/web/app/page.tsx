"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const messages = [
  "where every gathering begins ✨",
  "1K+ messages delivered and counting 📩",
  "10+ events created successfully 🎉",
  "reliable delivery, every time ⚡",
  "built for scale — 10K+ messages 🚀",
];

export default function LandingPage() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // ✨ Typing effect
  useEffect(() => {
    const current = messages[index];

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + current[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 35);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % messages.length);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, index]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#140d0f]">

      {/* 🌈 DARK GRADIENT BASE */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f12] via-[#140d0f] to-[#1a0f12]" />

      {/* 🔴 BIG FLOATING BUBBLES */}
      <div className="bubble bubble1" />
      <div className="bubble bubble2" />
      <div className="bubble bubble3" />
      <div className="bubble bubble4" />

      {/* 🧭 NAVBAR */}
      <div className="absolute top-0 right-0 p-6 flex gap-4 z-10">
        <Link
          href="/login"
          className="px-4 py-2 rounded-full border border-gray-600 text-gray-300
          hover:border-transparent hover:text-white
          hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500
          transition-all duration-300"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-5 py-2 rounded-full text-white
          bg-gradient-to-r from-pink-500 to-red-500
          shadow-lg hover:shadow-2xl hover:scale-105
          transition-all duration-300"
        >
          Signup
        </Link>
      </div>

      {/* 💎 MAIN */}
      <div className="text-center z-10 px-6">

        {/* BRAND */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent animate-gradient">
            Mehfil
          </span>
        </h1>

        {/* ✨ TYPING */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 h-8">
          {text}
          <span className="animate-pulse">|</span>
        </p>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-full text-white text-lg font-medium
            bg-gradient-to-r from-pink-500 to-red-500
            shadow-lg hover:shadow-2xl hover:scale-105
            transition-all duration-300"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-8 py-3 rounded-full border border-gray-600 text-gray-300
            hover:border-transparent hover:text-white
            hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500
            transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        /* 🌈 Gradient animation */
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 6s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 🔴 BUBBLES */
        .bubble {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: float 20s infinite ease-in-out;
        }

        .bubble1 {
          width: 300px;
          height: 300px;
          background: #ff4d6d;
          top: 10%;
          left: 10%;
        }

        .bubble2 {
          width: 400px;
          height: 400px;
          background: #fb7185;
          bottom: 10%;
          right: 10%;
          animation-delay: 5s;
        }

        .bubble3 {
          width: 250px;
          height: 250px;
          background: #f43f5e;
          top: 50%;
          left: 60%;
          animation-delay: 2s;
        }

        .bubble4 {
          width: 200px;
          height: 200px;
          background: #ec4899;
          bottom: 30%;
          left: 20%;
          animation-delay: 7s;
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-40px) translateX(20px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Invalid email format");

    try {
      await forgotPassword({ email }).unwrap();
      router.push(
        `/verify?email=${encodeURIComponent(email)}&purpose=forgot-password`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        background: "#0d0810",
        color: "#f5f0ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0810; }
        ::-webkit-scrollbar-thumb { background: #e91e8c; border-radius: 2px; }

        @keyframes floatBubble {
          0%   { transform: translateY(0) translateX(0) scale(1); }
          33%  { transform: translateY(-30px) translateX(15px) scale(1.05); }
          66%  { transform: translateY(10px) translateX(-10px) scale(0.97); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fall {
          0%   { transform: translateY(-20px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(54px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(54px) rotate(-360deg); }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f5f0ff 0%, #e91e8c 30%, #ff9800 50%, #e91e8c 70%, #f5f0ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f5f0ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: rgba(245,240,255,0.3); }
        .login-input:focus {
          border-color: rgba(233,30,140,0.5);
          background: rgba(233,30,140,0.06);
          box-shadow: 0 0 0 3px rgba(233,30,140,0.12);
        }

        .btn-primary {
          width: 100%;
          padding: 15px 20px;
          border-radius: 100px;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(233,30,140,0.35);
          letter-spacing: 0.3px;
        }
        .btn-primary:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 8px 36px rgba(233,30,140,0.5);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .link-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #e91e8c;
          transition: opacity 0.2s;
          padding: 0;
        }
        .link-btn:hover { opacity: 0.75; text-decoration: underline; }

        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .star {
          position: absolute;
          width: 2px;
          height: 12px;
          background: rgba(233,30,140,0.6);
          border-radius: 2px;
          filter: blur(0.5px);
          animation: fall linear infinite;
        }

        .fadeUp-1 { animation: fadeUp 0.6s ease 0.0s both; }
        .fadeUp-2 { animation: fadeUp 0.6s ease 0.1s both; }
        .fadeUp-3 { animation: fadeUp 0.6s ease 0.2s both; }
        .fadeUp-4 { animation: fadeUp 0.6s ease 0.35s both; }
      `}</style>

      {/* ── Floating ambient bubbles ── */}
      {[
        { w: 500, h: 500, l: "-5%",  t: "-10%", c: "#e91e8c", d: 0,  dur: 18 },
        { w: 350, h: 350, r: "-5%",  b: "-5%",  c: "#ff5252", d: 5,  dur: 22 },
        { w: 250, h: 250, l: "60%",  t: "40%",  c: "#9c27b0", d: 9,  dur: 16 },
        { w: 180, h: 180, l: "15%",  t: "65%",  c: "#ff9800", d: 13, dur: 20 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            width: b.w,
            height: b.h,
            left: (b as any).l,
            right: (b as any).r,
            top: (b as any).t,
            bottom: (b as any).b,
            background: b.c,
            filter: "blur(100px)",
            opacity: 0.1,
            animation: `floatBubble ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.d}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Dot grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: "radial-gradient(circle, #f5f0ff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* ── Falling stars ── */}
      {mounted &&
        Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 5.7 + Math.sin(i) * 8) % 100}%`,
              animationDelay: `${(i * 0.37) % 6}s`,
              animationDuration: `${7 + (i % 5)}s`,
            }}
          />
        ))}

      {/* ── Navbar ── */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          <span style={{ color: "#e91e8c" }}>పి</span>
          <span style={{ color: "#f5f0ff" }}>lupoo</span>
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "rgba(245,240,255,0.4)",
          }}
        >
          <span>Know your password?</span>
          <button
            className="link-btn"
            style={{ fontSize: 13, fontWeight: 500 }}
            onClick={() => router.push("/login")}
          >
            Sign in →
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px 60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Icon */}
          <div className="fadeUp-1" style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(233,30,140,0.12)",
                border: "1px solid rgba(233,30,140,0.25)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                marginBottom: 20,
              }}
            >
              🔑
            </div>

            {/* Eyebrow badge */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(233,30,140,0.12)",
                  border: "1px solid rgba(233,30,140,0.25)",
                  borderRadius: 100,
                  padding: "6px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "rgba(245,240,255,0.6)",
                  letterSpacing: "0.02em",
                }}
              >
                <span>We'll send a reset code to your inbox</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="fadeUp-2" style={{ textAlign: "center", marginBottom: 36 }}>
            <h1
              style={{
                fontSize: "clamp(34px, 6vw, 50px)",
                fontWeight: 900,
                lineHeight: 1.08,
                marginBottom: 10,
              }}
            >
              <span className="shimmer-text">Reset your</span>
              <br />
              <span
                style={{
                  color: "rgba(245,240,255,0.85)",
                  fontSize: "0.65em",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                password
              </span>
            </h1>
          </div>

          {/* Card */}
          <div
            className="card-glass fadeUp-3"
            style={{
              borderRadius: 24,
              padding: "36px 32px",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(233,30,140,0.08)",
            }}
          >
            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(255,82,82,0.12)",
                  border: "1px solid rgba(255,82,82,0.25)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  marginBottom: 20,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#ff8a8a",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(245,240,255,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email address
              </label>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="email"
              />
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "rgba(245,240,255,0.25)",
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                Enter the email linked to your Pilupoo account
              </p>
            </div>

            {/* Submit */}
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ display: "inline-block", animation: "pulse-dot 1s infinite" }}>
                    ●
                  </span>
                  Sending reset code…
                </span>
              ) : (
                "Send Reset Code →"
              )}
            </button>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "24px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "rgba(245,240,255,0.2)",
                  letterSpacing: "0.1em",
                }}
              >
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Back to login */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(245,240,255,0.4)",
                textAlign: "center",
              }}
            >
              Remember your password?{" "}
              <button
                className="link-btn"
                onClick={() => router.push("/login")}
                style={{ fontWeight: 500 }}
              >
                Back to login
              </button>
            </p>
          </div>

          {/* Trust badges */}
          <div
            className="fadeUp-4"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: "🔐", text: "Secure reset link" },
              { icon: "⏱", text: "Code valid 15 mins" },
              { icon: "✅", text: "99.9% delivery rate" },
            ].map((badge) => (
              <div
                key={badge.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "rgba(245,240,255,0.25)",
                  letterSpacing: "0.04em",
                }}
              >
                <span style={{ fontSize: 12 }}>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
          © 2025 పిlooopu. Built with ❤️ in Bangalore.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
            All systems operational
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,240,255,0.2)" }}>
          పిలుపు — Invitation in Telugu 🙏
        </p>
      </footer>
    </div>
  );
}
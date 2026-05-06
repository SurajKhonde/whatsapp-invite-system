"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "Store/apiSlice";

export default function LogoutPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [mounted, setMounted] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout({ feedback }).unwrap();
      router.push("/login");
    } catch (err) {
      console.error(err);
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

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(20deg); }
          75%       { transform: rotate(-10deg); }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f5f0ff 0%, #e91e8c 30%, #ff9800 50%, #e91e8c 70%, #f5f0ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .feedback-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f5f0ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          resize: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          line-height: 1.6;
        }
        .feedback-input::placeholder { color: rgba(245,240,255,0.3); }
        .feedback-input:focus {
          border-color: rgba(233,30,140,0.5);
          background: rgba(233,30,140,0.06);
          box-shadow: 0 0 0 3px rgba(233,30,140,0.12);
        }

        .btn-logout {
          flex: 1;
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
        .btn-logout:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 8px 36px rgba(233,30,140,0.5);
        }
        .btn-logout:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-stay {
          flex: 1;
          padding: 15px 20px;
          border-radius: 100px;
          background: transparent;
          border: 1px solid rgba(245,240,255,0.15);
          color: rgba(245,240,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          letter-spacing: 0.3px;
        }
        .btn-stay:hover {
          border-color: rgba(233,30,140,0.4);
          color: #e91e8c;
          background: rgba(233,30,140,0.06);
        }

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

        .wave-emoji {
          display: inline-block;
          animation: wave 1.8s ease-in-out infinite;
          transform-origin: 70% 70%;
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

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "rgba(245,240,255,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e91e8c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,240,255,0.4)")}
        >
          ← Back to dashboard
        </button>
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
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Waving icon */}
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
                fontSize: 32,
                marginBottom: 20,
              }}
            >
              <span className="wave-emoji">👋</span>
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
                <span>Your invites are safe — see you next time</span>
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
              <span className="shimmer-text">See you</span>
              <br />
              <span
                style={{
                  color: "rgba(245,240,255,0.85)",
                  fontSize: "0.65em",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                soon ✨
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
            {/* Feedback label */}
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
              Before you go — any thoughts? <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>

            <textarea
              className="feedback-input"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what could be better, what you loved, or anything on your mind..."
              style={{ marginBottom: 8 }}
            />

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "rgba(245,240,255,0.2)",
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              Your feedback shapes Pilupoo's roadmap 🛠
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn-stay"
                onClick={() => router.push("/dashboard")}
              >
                Stay
              </button>
              <button
                className="btn-logout"
                onClick={handleLogout}
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
                    <span style={{ display: "inline-block", animation: "pulse-dot 1s infinite" }}>●</span>
                    Logging out…
                  </span>
                ) : (
                  "Logout 🚪"
                )}
              </button>
            </div>
          </div>

          {/* Footer message */}
          <div
            className="fadeUp-4"
            style={{
              textAlign: "center",
              marginTop: 28,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(245,240,255,0.25)",
                lineHeight: 1.7,
              }}
            >
              Thanks for being part of Pilupoo ❤️<br />
              Your moments matter. Come back anytime.
            </p>
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
          © 2025 Pilupoo. Built with ❤️ in Bangalore.
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
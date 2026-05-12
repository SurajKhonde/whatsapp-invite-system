
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "Store/apiSlice";
import styles from "./Logout.module.css";

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
    <div className={styles.page}>
      {/* Floating bubbles */}
      {[
        { w: 500, h: 500, l: "-5%", t: "-10%", c: "#e91e8c", d: 0, dur: 18 },
        { w: 350, h: 350, r: "-5%", b: "-5%", c: "#ff5252", d: 5, dur: 22 },
        { w: 250, h: 250, l: "60%", t: "40%", c: "#9c27b0", d: 9, dur: 16 },
        { w: 180, h: 180, l: "15%", t: "65%", c: "#ff9800", d: 13, dur: 20 },
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

      {/* Dot grid */}
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

      {/* Falling stars */}
      {mounted &&
        Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${(i * 5.7 + Math.sin(i) * 8) % 100}%`,
              animationDelay: `${(i * 0.37) % 6}s`,
              animationDuration: `${7 + (i % 5)}s`,
            }}
          />
        ))}

      {/* Navbar */}
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoHighlight}>పి</span>
          <span>lupoo</span>
        </a>

        <button className={styles.backBtn} onClick={() => router.push("/dashboard")}>
          ← Back to dashboard
        </button>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Waving icon */}
          <div className={styles.fadeUp1}>
            <div className={styles.iconBox}>
              <div className={styles.icon}>
                <span className={styles.waveEmoji}>👋</span>
              </div>

              <div className={styles.badge}>
                <span>Your invites are safe — see you next time</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className={`${styles.headline} ${styles.fadeUp2}`}>
            <h1 className={styles.title}>
              <span className={styles.shimmering}>See you</span>
              <br />
              <span className={styles.subtitle}>soon ✨</span>
            </h1>
          </div>

          {/* Card */}
          <div className={`${styles.glass} ${styles.card} ${styles.fadeUp3}`}>
            {/* Feedback label */}
            <label className={styles.label}>
              Before you go — any thoughts?{" "}
              <span className={styles.optional}>(optional)</span>
            </label>

            <textarea
              className={styles.textarea}
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what could be better, what you loved, or anything on your mind..."
            />

            <p className={styles.hint}>
              Your feedback shapes పిlooopu's roadmap 🛠
            </p>

            {/* Buttons */}
            <div className={styles.buttons}>
              <button className={styles.btnStay} onClick={() => router.push("/dashboard")}>
                Stay
              </button>
              <button className={styles.btnLogout} onClick={handleLogout} disabled={isLoading}>
                {isLoading ? (
                  <span className={styles.loading}>
                    <span className={styles.pulse}>●</span>
                    Logging out…
                  </span>
                ) : (
                  "Logout 🚪"
                )}
              </button>
            </div>
          </div>

          {/* Footer message */}
          <div className={`${styles.message} ${styles.fadeUp4}`}>
            <p>
              Thanks for being part of పిlooopu ❤️
              <br />
              Your moments matter. Come back anytime.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 పిlooopu. Built with ❤️ in Bangalore.
        </p>
        <div className={styles.statusGroup}>
          <div className={styles.statusLight} />
          <span className={styles.footerText}>All systems operational</span>
        </div>
        <p className={styles.footerText}>
          పిలుపు — Invitation in Telugu 🙏
        </p>
      </footer>
    </div>
  );
}
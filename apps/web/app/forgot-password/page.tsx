"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";
import styles from "./ForgotPassword.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setError("");
    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Invalid email format");

    try {
      await forgotPassword({ email }).unwrap();
      router.push(`/verify?email=${encodeURIComponent(email)}&purpose=forgot-password`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className={styles.page}>
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

      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoHighlight}>పి</span>
          <span>loopu</span>
        </a>
        <div className={styles.navRight}>
          <span>Know your password?</span>
          <button className={styles.linkBtn} onClick={() => router.push("/login")}>
            Sign in →
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.fadeUp1}>
            <div className={styles.iconBox}>
              <div className={styles.icon}>🔑</div>
              <div>
                <div className={styles.badge}>
                  <span>We'll send a reset code to your inbox</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.headline} ${styles.fadeUp2}`}>
            <h1 className={styles.title}>
              <span className={styles.shimmering}>Reset your</span>
              <br />
              <span className={styles.subtitle}>password</span>
            </h1>
          </div>

          <div className={`${styles.glass} ${styles.card} ${styles.fadeUp3}`}>
            {error && (
              <div className={styles.error}>
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="email"
              />
              <p className={styles.hint}>
                Enter the email linked to your పిlooopu account
              </p>
            </div>

            <button className={styles.button} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", animation: "pulse-dot 1s infinite" }}>
                    ●
                  </span>
                  Sending reset code…
                </span>
              ) : (
                "Send Reset Code →"
              )}
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            <p className={styles.backLink}>
              Remember your password?{" "}
              <button
                className={styles.linkBtn}
                onClick={() => router.push("/login")}
                style={{ fontWeight: 500 }}
              >
                Back to login
              </button>
            </p>
          </div>

          <div className={`${styles.badges} ${styles.fadeUp4}`}>
            {[
              { icon: "🔐", text: "Secure reset link" },
              { icon: "⏱", text: "Code valid 15 mins" },
              { icon: "✅", text: "99.9% delivery rate" },
            ].map((badge) => (
              <div key={badge.text} className={styles.badgeItem}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

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
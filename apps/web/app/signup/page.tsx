"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/store/apiSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getErrorMessage } from "@/lib/errors";
import {
  setLoading,
  setError as setAuthError,
} from "@/store/slices/authSlice";
import styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [signup, { isLoading }] = useSignupMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleSignup = async () => {
    setError("");
    dispatch(setLoading(true));

    if (!name || !email || !password) {
      setError("All fields are required");
      dispatch(setLoading(false));
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      dispatch(setLoading(false));
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be 8+ chars, include uppercase, number & special char");
      dispatch(setLoading(false));
      return;
    }

    try {
      await signup({ name, email, password, role: "user" }).unwrap();
      router.replace(`/verify?email=${encodeURIComponent(email)}&purpose=signup`);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(setAuthError(errorMessage));
    } finally {
      dispatch(setLoading(false));
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
          className={styles.blob}
          style={{
            width: `${b.w}px`,
            height: `${b.h}px`,
            left: (b as any).l,
            right: (b as any).r,
            top: (b as any).t,
            bottom: (b as any).b,
            background: b.c,
            animation: `floatBubble ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.d}s`,
          }}
        />
      ))}

      {/* Dot grid */}
      <div className={styles.grid} />

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
          <span className={styles.logoP}>పి</span>
          <span className={styles.logoRest}>lupoo</span>
        </a>

        <div className={styles.navRight}>
          <span>Already a member?</span>
          <button
            className={styles.linkBtn}
            onClick={() => router.push("/login")}
          >
            Sign in →
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Badge */}
          <div className={styles.fadeUp1}>
            <div className={styles.badge}>
              <span>🚀</span>
              <span>Join thousands sending invites with పిlooopu</span>
            </div>
          </div>

          {/* Headline */}
          <div className={`${styles.headline} ${styles.fadeUp2}`}>
            <h1 className={styles.title}>
              <span className={styles.shimmer}>Get started</span>
              <br />
              <span className={styles.subtitle}>it's free to join</span>
            </h1>
          </div>

          {/* Card */}
          <div className={`${styles.glass} ${styles.card} ${styles.fadeUp3}`}>
            {/* Error */}
            {error && (
              <div className={styles.error}>
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Name field */}
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                autoComplete="name"
              />
            </div>

            {/* Email field */}
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                autoComplete="email"
              />
            </div>

            {/* Password field */}
            <div className={styles.fieldLast}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  type={show ? "text" : "password"}
                  placeholder="Min 8 chars, A–Z, 0–9, symbol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <p className={styles.hint}>
                Must include uppercase, number & special character (@$!%*?&)
              </p>
            </div>

            {/* Submit */}
            <button
              className={styles.button}
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.pulse}>●</span>
                  Creating account…
                </span>
              ) : (
                "Create Account →"
              )}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            {/* Sign in link */}
            <p className={styles.signIn}>
              Already have an account?{" "}
              <button
                className={styles.linkBtn}
                onClick={() => router.push("/login")}
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Trust badges */}
          <div className={`${styles.badges} ${styles.fadeUp4}`}>
            {[
              { icon: "🔐", text: "AES-256 encrypted" },
              { icon: "🇮🇳", text: "Made in India" },
              { icon: "💰", text: "No hidden fees" },
            ].map((badge) => (
              <div key={badge.text} className={styles.badgeItem}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "Store/apiSlice";
import { getErrorMessage } from "@/lib/errors";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      return setError("All fields are required");
    }

    if (!validateEmail(email)) {
      return setError("Invalid email format");
    }

    if (!validatePassword(password)) {
      return setError("Password must be 8+ chars, include uppercase, number & special char");
    }

    try {
      await login({
        email,
        password,
      }).unwrap();

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={`${styles.bubble} ${styles.b1}`} />
      <div className={`${styles.bubble} ${styles.b2}`} />
      <div className={`${styles.bubble} ${styles.b3}`} />
      <div className={`${styles.bubble} ${styles.b4}`} />

      <div className={styles.grid} />

      {/* Stars */}
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
      <nav className={styles.navbar}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoPink}>పి</span>
          <span className={styles.logoWhite}>lupoo</span>
        </a>

        <div className={styles.navRight}>
          <span>New here?</span>
          <button
            className={styles.linkBtn}
            onClick={() => router.push("/signup")}
          >
            Create account →
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Badge */}
          <div className={styles.badgeWrap}>
            <div className={styles.badge}>
              <span>💌</span>
              <span>Welcome back to Pilupoo</span>
            </div>
          </div>

          {/* Heading */}
          <div className={styles.heading}>
            <h1>
              <span className={styles.shimmer}>Sign in</span>
              <br />
              <span className={styles.subHeading}>to continue your journey</span>
            </h1>
          </div>

          {/* Card */}
          <div className={styles.card}>
            {/* Error */}
            {error && <div className={styles.errorBox}>⚠ {error}</div>}

            {/* Email */}
            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className={styles.forgotWrap}>
              <button
                className={styles.linkBtn}
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              className={styles.primaryBtn}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login to Pilupoo →"}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <div />
              <span>OR</span>
              <div />
            </div>

            {/* Signup */}
            <p className={styles.footerText}>
              Don't have an account?{" "}
              <button
                className={styles.linkBtn}
                onClick={() => router.push("/signup")}
              >
                Sign up free
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
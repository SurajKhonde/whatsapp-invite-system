"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/store/apiSlice";
import styles from "./Verify.module.css";

type Purpose = "signup" | "forgot-password";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose") as Purpose;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(40);
  const [resendCount, setResendCount] = useState(true);
  const [mounted, setMounted] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setMounted(true);
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const finalOtp = otp.join("");
    if (finalOtp.length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const resetOtpState = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      setError(true);
      return;
    }

    try {
      await verifyOtp({ email: email!, otp: finalOtp, purpose }).unwrap();
      setIsVerified(true);
      resetOtpState();
      setTimeout(() => {
        if (purpose === "signup") router.replace("/dashboard");
        else if (purpose === "forgot-password")
          router.replace(`/reset-new-password?email=${email}`);
      }, 1500);
    } catch (err) {
      setError(true);
      resetOtpState();
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email: email!, purpose }).unwrap();
      setResendCount(true);
      resetOtpState();
      setTimer(40);
    } catch (err: any) {
      if (err?.status === 429) setResendCount(false);
    }
  };

  const handleSkip = () => router.replace("/dashboard");

  const timerPct = (timer / 40) * 100;
  const circumference = 2 * Math.PI * 20;

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
        <div className={styles.navText}>Check your inbox for the code</div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.container}>
          {isVerified ? (
            /* Success state */
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successTitle}>
                <span className={styles.successText}>Verified!</span>
              </h2>
              <p className={styles.successMessage}>
                Redirecting you now
                <span className={styles.dots}>…</span>
              </p>
            </div>
          ) : (
            <>
              {/* Eyebrow badge */}
              <div className={styles.fadeUp1}>
                <div className={styles.iconBox}>
                  <div className={styles.icon}>📬</div>
                  <div className={styles.badge}>
                    <span>Code sent to</span>
                    <span className={styles.badgeEmail}>{email}</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className={`${styles.headline} ${styles.fadeUp2}`}>
                <h1 className={styles.title}>
                  <span className={styles.shimmering}>Enter your</span>
                  <br />
                  <span className={styles.subtitle}>
                    {purpose === "signup" ? "verification code" : "reset code"}
                  </span>
                </h1>
              </div>

              {/* Card */}
              <div className={`${styles.glass} ${styles.card} ${styles.fadeUp3}`}>
                {/* OTP inputs */}
                <div className={styles.otpSection}>
                  <label className={styles.otpLabel}>6-digit code</label>

                  <div className={styles.otpInputs}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          setError(false);
                          handleChange(e.target.value, i);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`${styles.otpInput} ${error ? styles.otpError : digit ? styles.otpFilled : ""}`}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className={styles.errorMessage}>
                      <span>⚠</span>
                      <span>Invalid OTP — please try again</span>
                    </div>
                  )}
                </div>

                {/* Verify button */}
                <button
                  className={styles.button}
                  onClick={handleVerify}
                  disabled={isLoading || otp.join("").length < 6}
                >
                  {isLoading ? (
                    <span className={styles.loading}>
                      <span className={styles.pulse}>●</span>
                      Verifying…
                    </span>
                  ) : (
                    "Verify Code →"
                  )}
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>RESEND</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Timer / Resend / Skip */}
                <div className={styles.resendSection}>
                  {timer > 0 ? (
                    <div className={styles.timerContainer}>
                      <div className={styles.timerRing}>
                        <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                          <circle
                            cx="26"
                            cy="26"
                            r="20"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="3"
                          />
                          <circle
                            cx="26"
                            cy="26"
                            r="20"
                            fill="none"
                            stroke="#e91e8c"
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (timerPct / 100) * circumference}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1s linear" }}
                          />
                        </svg>
                        <div className={styles.timerText}>{timer}</div>
                      </div>
                      <p className={styles.timerLabel}>Resend available in {timer}s</p>
                    </div>
                  ) : resendCount ? (
                    <button
                      className={styles.resendBtn}
                      onClick={handleResend}
                      disabled={resendLoading}
                    >
                      {resendLoading ? (
                        <span className={styles.resendLoading}>
                          <span className={styles.pulse}>●</span>
                          Sending…
                        </span>
                      ) : (
                        "Resend OTP →"
                      )}
                    </button>
                  ) : (
                    <div className={styles.skipSection}>
                      <p className={styles.skipText}>Not receiving the code?</p>
                      <button className={styles.skipBtn} onClick={handleSkip}>
                        Continue anyway →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div className={`${styles.badges} ${styles.fadeUp4}`}>
                {[
                  { icon: "🔐", text: "Code expires in 10 mins" },
                  { icon: "📩", text: "Check spam folder" },
                  { icon: "✅", text: "One-time use only" },
                ].map((badge) => (
                  <div key={badge.text} className={styles.badgeItem}>
                    <span className={styles.badgeIcon}>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 Pilupoo. Built with ❤️ in Bangalore.
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

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/store/apiSlice";
import styles from "./Verify.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setUser, setError as setAuthError } from "@/store/slices/authSlice";
import { getErrorMessage } from "@/lib/errors";

type Purpose = "signup" | "forgot-password";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose") as Purpose;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(40);
  const [resendCount, setResendCount] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // ✅ NEW: Track failed attempts
  const [failedAttempts, setFailedAttempts] = useState(0);
  // ✅ NEW: Show "Continue without verification" after 3 failed attempts
  const MAX_FAILED_ATTEMPTS = 3;
  const showContinueButton = failedAttempts >= MAX_FAILED_ATTEMPTS;

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      setError("");
      return;
    }

    try {
      const response = await verifyOtp({
        email: email!,
        otp: finalOtp,
        purpose,
      }).unwrap();

      // ✅ Email verified successfully
      if (response?.data?.user) {
        dispatch(
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            role: response.data.user.role || "user",
            isEmailVerified: response.data.user.isEmailVerified,
            isActive: response.data.user.isActive || true,
            profileImageUrl: response.data.user.profileImageUrl,
          })
        );
      }

      setIsVerified(true);
      resetOtpState();

      setTimeout(() => {
        if (purpose === "signup") router.replace("/dashboard");
        else if (purpose === "forgot-password")
          router.replace(`/reset-new-password?email=${email}`);
      }, 1500);
    } catch (err) {
      // ✅ OTP verification failed
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(setAuthError(errorMessage));

      // ✅ Track failed attempts
      setFailedAttempts((prev) => prev + 1);

      // Reset OTP input
      resetOtpState();
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email: email!, purpose }).unwrap();
      setResendCount(true);
      setFailedAttempts(0); // ✅ Reset attempts when resending
      resetOtpState();
      setTimer(40);
      setError(""); // Clear any previous errors
    } catch (err: any) {
      if (err?.status === 429) setResendCount(false);
    }
  };

  const handleContinueWithoutVerification = () => {

    if (purpose === "signup") {
      router.replace("/dashboard");
    } else if (purpose === "forgot-password") {

      router.replace("/login");
    }
  };

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
          backgroundImage:
            "radial-gradient(circle, #f5f0ff 1px, transparent 1px)",
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
          <span>looopu</span>
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
                    {purpose === "signup"
                      ? "verification code"
                      : "reset code"}
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
                          setError("");
                          handleChange(e.target.value, i);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`${styles.otpInput} ${
                          error ? styles.otpError : digit ? styles.otpFilled : ""
                        }`}
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
                  {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && (
                    <div className={styles.attemptCount}>
                      {MAX_FAILED_ATTEMPTS - failedAttempts} attempt
                      {MAX_FAILED_ATTEMPTS - failedAttempts !== 1 ? "s" : ""}{" "}
                      remaining
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
                        <svg
                          width="52"
                          height="52"
                          style={{ transform: "rotate(-90deg)" }}
                        >
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
                            strokeDashoffset={
                              circumference -
                              (timerPct / 100) * circumference
                            }
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1s linear" }}
                          />
                        </svg>
                        <div className={styles.timerText}>{timer}</div>
                      </div>
                      <p className={styles.timerLabel}>
                        Resend available in {timer}s
                      </p>
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
                    // ✅ NEW: Show this after 3 failed attempts or resend limit
                    <div className={styles.skipSection}>
                      <p className={styles.skipText}>
                        {showContinueButton
                          ? "Can't verify now?"
                          : "Not receiving the code?"}
                      </p>
                      <button
                        className={styles.skipBtn}
                        onClick={handleContinueWithoutVerification}
                      >
                        {showContinueButton
                          ? "Continue anyway →"
                          : "Continue to dashboard →"}
                      </button>
                      {showContinueButton && (
                        <p className={styles.skipSubtext}>
                          You can verify email anytime from dashboard banner
                        </p>
                      )}
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
"use client";

import { useEffect, useState } from "react";
import styles from "./error.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [autoRetried, setAutoRetried] = useState(false);

  useEffect(() => {
    if (seconds <= 0 && !autoRetried) {
      setAutoRetried(true);
      reset();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, autoRetried, reset]);

  const copyError = () => {
    const text = `Error: ${error.message}\nDigest: ${error.digest || "N/A"}\nURL: ${window.location.href}\nTime: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailBody = encodeURIComponent(
    `Hi Pilupoo Support,\n\nI ran into an issue on the app.\n\nError: ${error.message}\nDigest: ${error.digest || "N/A"}\nPage: ${typeof window !== "undefined" ? window.location.href : ""}\nTime: ${new Date().toISOString()}\n\nPlease help!`
  );

  return (
    <div className={styles.page}>
      <div
        className={styles.blob}
        style={{
          width: 500,
          height: 500,
          left: "-15%",
          top: "-15%",
          background: "#e91e8c",
          opacity: 0.06,
        }}
      />
      <div
        className={styles.blob}
        style={{
          width: 350,
          height: 350,
          right: "-10%",
          bottom: "-10%",
          background: "#ff5252",
          opacity: 0.05,
          animationDelay: "6s",
        }}
      />
      <div className={styles.grid} />

      <div className={styles.card}>
        <div className={styles.iconWrap}>⚠️</div>

        <div className={styles.code}>Something went wrong</div>
        <h1 className={styles.title}>Oops! Page crashed</h1>
        <p className={styles.desc}>
          We hit an unexpected error. Don't worry — your data is safe. We're automatically
          retrying in a moment. If this keeps happening,{" "}
          <a href={`mailto:hello@pilooopu.shop?subject=App Error&body=${mailBody}`}>email us</a> and
          we'll fix it fast.
        </p>

        <div className={styles.countdown}>
          <div className={styles.countdownLabel}>Auto-retrying</div>
          <div className={styles.countdownTrack}>
            <div className={styles.countdownFill} style={{ width: `${(seconds / 10) * 100}%` }} />
          </div>
          <div className={styles.countdownNum}>
            Retrying in <span>{seconds}s</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setSeconds(10);
              setAutoRetried(false);
              reset();
            }}
          >
            ↺ Try Again Now
          </button>
          <div className={styles.btnRow}>
            <button
              className={styles.btnGhost}
              onClick={() => (window.location.href = "/dashboard")}
            >
              🏠 Go Home
            </button>
            <a
              className={styles.btnGhost}
              href={`mailto:hello@pil.shop?subject=App Error Report&body=${mailBody}`}
            >
              ✉ Email Support
            </a>
          </div>
          <button className={styles.btnGhost} onClick={copyError}>
            {copied ? "✓ Copied to clipboard" : "📋 Copy error details"}
          </button>
        </div>

        <details className={styles.detail}>
          <summary>Technical details</summary>
          <div className={styles.detailText}>
            <div>Error: {error.message}</div>
            {error.digest && <div>Digest: {error.digest}</div>}
            <div>Time: {new Date().toISOString()}</div>
          </div>
        </details>
      </div>
 </div>   
  );
}
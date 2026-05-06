"use client";

// app/error.tsx
// Next.js catches ALL unhandled errors here automatically
// "use client" is required by Next.js for error boundaries

import { useEffect, useState } from "react";

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

  // Auto retry countdown
  useEffect(() => {
    if (seconds <= 0 && !autoRetried) {
      setAutoRetried(true);
      reset();
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .err-page {
          min-height: 100vh;
          background: #0d0810;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative; overflow: hidden;
        }
        .err-blob {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none;
          animation: blobFloat 16s ease-in-out infinite;
        }
        @keyframes blobFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-30px) scale(1.04); }
        }
        .err-grid {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(245,240,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px; pointer-events: none;
        }
        .err-card {
          position: relative; z-index: 2;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 520px; width: 100%;
          text-align: center;
          backdrop-filter: blur(16px);
        }
        .err-icon-wrap {
          width: 80px; height: 80px; border-radius: 22px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; margin: 0 auto 24px;
          animation: iconShake 0.5s ease 0.2s both;
        }
        @keyframes iconShake {
          0%,100% { transform: rotate(0); }
          25%      { transform: rotate(-8deg); }
          75%      { transform: rotate(8deg); }
        }
        .err-code {
          font-size: 11px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: #f87171;
          margin-bottom: 10px;
        }
        .err-title {
          font-size: 26px; font-weight: 800; color: #f5f0ff;
          margin-bottom: 12px; line-height: 1.2;
        }
        .err-desc {
          font-size: 14px; color: rgba(245,240,255,0.4);
          line-height: 1.7; margin-bottom: 28px;
        }
        .err-desc a { color: #e91e8c; text-decoration: none; }
        .err-desc a:hover { text-decoration: underline; }

        /* Auto retry bar */
        .err-countdown {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 12px 16px;
          margin-bottom: 24px; text-align: left;
        }
        .err-countdown-label {
          font-size: 11px; color: rgba(245,240,255,0.3);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .err-countdown-track {
          height: 3px; background: rgba(255,255,255,0.06);
          border-radius: 100px; overflow: hidden;
        }
        .err-countdown-fill {
          height: 100%; background: linear-gradient(90deg, #e91e8c, #ff5252);
          border-radius: 100px;
          transition: width 1s linear;
        }
        .err-countdown-num {
          font-size: 12px; color: rgba(245,240,255,0.4); margin-top: 6px;
        }
        .err-countdown-num span { color: #e91e8c; font-weight: 700; }

        /* Buttons */
        .err-actions { display: flex; flex-direction: column; gap: 10px; }
        .err-btn-primary {
          width: 100%; padding: 13px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 18px rgba(233,30,140,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .err-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(233,30,140,0.4); }

        .err-btn-row { display: flex; gap: 8px; }
        .err-btn-ghost {
          flex: 1; padding: 11px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(245,240,255,0.5); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          text-decoration: none;
        }
        .err-btn-ghost:hover { border-color: rgba(233,30,140,0.3); color: #f5f0ff; }

        /* Error detail */
        .err-detail {
          margin-top: 24px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 14px 16px;
          text-align: left;
        }
        .err-detail summary {
          font-size: 11px; color: rgba(245,240,255,0.25);
          cursor: pointer; letter-spacing: 0.05em;
          user-select: none; text-transform: uppercase;
        }
        .err-detail-text {
          font-size: 11px; color: rgba(245,240,255,0.3);
          font-family: monospace; margin-top: 10px;
          word-break: break-all; line-height: 1.6;
        }
      `}</style>

      <div className="err-page">
        <div className="err-blob" style={{ width:500, height:500, left:"-15%", top:"-15%", background:"#e91e8c", opacity:0.06 }} />
        <div className="err-blob" style={{ width:350, height:350, right:"-10%", bottom:"-10%", background:"#ff5252", opacity:0.05, animationDelay:"6s" }} />
        <div className="err-grid" />

        <div className="err-card">
          <div className="err-icon-wrap">⚠️</div>

          <div className="err-code">Something went wrong</div>
          <h1 className="err-title">Oops! Page crashed</h1>
          <p className="err-desc">
            We hit an unexpected error. Don't worry — your data is safe.
            We're automatically retrying in a moment.
            If this keeps happening, <a href={`mailto:hello@pilupoo.com?subject=App Error&body=${mailBody}`}>email us</a> and we'll fix it fast.
          </p>

          {/* Countdown */}
          <div className="err-countdown">
            <div className="err-countdown-label">Auto-retrying</div>
            <div className="err-countdown-track">
              <div className="err-countdown-fill" style={{ width: `${(seconds / 10) * 100}%` }} />
            </div>
            <div className="err-countdown-num">
              Retrying in <span>{seconds}s</span>
            </div>
          </div>

          <div className="err-actions">
            <button className="err-btn-primary" onClick={() => { setSeconds(10); setAutoRetried(false); reset(); }}>
              ↺ Try Again Now
            </button>
            <div className="err-btn-row">
              <button className="err-btn-ghost" onClick={() => window.location.href = "/dashboard"}>
                🏠 Go Home
              </button>
              <a
                className="err-btn-ghost"
                href={`mailto:hello@pilupoo.com?subject=App Error Report&body=${mailBody}`}
              >
                ✉ Email Support
              </a>
            </div>
            <button className="err-btn-ghost" onClick={copyError}>
              {copied ? "✓ Copied to clipboard" : "📋 Copy error details"}
            </button>
          </div>

          {/* Collapsible tech detail */}
          <details className="err-detail">
            <summary>Technical details</summary>
            <div className="err-detail-text">
              <div>Error: {error.message}</div>
              {error.digest && <div>Digest: {error.digest}</div>}
              <div>Time: {new Date().toISOString()}</div>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
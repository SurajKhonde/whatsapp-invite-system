"use client";

// components/OfflineBanner.tsx
// Add this inside your AppLayout — it watches network AND pings your backend
// Shows a beautiful banner when either goes offline

import { useEffect, useState, useCallback } from "react";

type Status = "online" | "offline" | "server-down";

export default function OfflineBanner() {
  const [status, setStatus]     = useState<Status>("online");
  const [visible, setVisible]   = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // ── Ping backend health endpoint ─────────────────────
  const checkServer = useCallback(async () => {
    try {
      const res = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),  // 5s timeout
      });
      if (res.ok) {
        setStatus("online");
        setVisible(false);
      } else {
        setStatus("server-down");
        setVisible(true);
      }
    } catch {
      if (!navigator.onLine) {
        setStatus("offline");
      } else {
        setStatus("server-down");
      }
      setVisible(true);
    }
    setLastChecked(new Date());
  }, []);

  // ── Browser online/offline events ────────────────────
  useEffect(() => {
    const goOffline = () => { setStatus("offline"); setVisible(true); };
    const goOnline  = () => { checkServer(); };  // verify server too

    window.addEventListener("offline", goOffline);
    window.addEventListener("online",  goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online",  goOnline);
    };
  }, [checkServer]);

  // ── Poll every 30s when offline ───────────────────────
  useEffect(() => {
    if (status === "online") return;
    const interval = setInterval(checkServer, 30_000);
    return () => clearInterval(interval);
  }, [status, checkServer]);

  // ── Initial check on mount ────────────────────────────
  useEffect(() => { checkServer(); }, [checkServer]);

  const handleRetry = async () => {
    setRetrying(true);
    await checkServer();
    setRetrying(false);
  };

  if (!visible) return null;

  const isOffline    = status === "offline";
  const isServerDown = status === "server-down";

  const mailBody = encodeURIComponent(
    `Hi Pilupoo Support,\n\nI'm experiencing connectivity issues on the app.\n\nStatus: ${status}\nTime: ${new Date().toISOString()}\nPage: ${typeof window !== "undefined" ? window.location.href : ""}\n\nPlease help!`
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .ob-wrap {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
          font-family: 'DM Sans', sans-serif;
          animation: obSlideDown 0.35s ease both;
        }
        @keyframes obSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }

        /* Top bar */
        .ob-bar {
          background: #0d0810;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0 20px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          min-height: 48px;
        }
        .ob-bar.offline     { border-bottom-color: rgba(248,113,113,0.3); background: rgba(20,5,5,0.98); }
        .ob-bar.server-down { border-bottom-color: rgba(245,158,11,0.3);  background: rgba(15,10,0,0.98); }

        /* Progress line at very top */
        .ob-progress {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #f87171, #ef4444);
        }
        .ob-bar.server-down .ob-progress {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          animation: obPulse 1.5s ease-in-out infinite;
        }
        @keyframes obPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        .ob-left { display: flex; align-items: center; gap: 10px; }

        .ob-icon {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
          flex-shrink: 0;
        }
        .ob-icon.offline     { background: rgba(248,113,113,0.15); }
        .ob-icon.server-down { background: rgba(251,191,36,0.15); }

        .ob-text { line-height: 1.3; }
        .ob-title {
          font-size: 13px; font-weight: 600;
          color: #f5f0ff;
        }
        .ob-sub {
          font-size: 11px; color: rgba(245,240,255,0.4);
        }
        .ob-sub a { color: #e91e8c; text-decoration: none; }
        .ob-sub a:hover { text-decoration: underline; }

        .ob-right { display: flex; align-items: center; gap: 8px; }

        .ob-retry {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 14px; border-radius: 8px; border: none;
          background: rgba(255,255,255,0.07);
          color: rgba(245,240,255,0.7); font-size: 12px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .ob-retry:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
        .ob-retry:disabled { opacity: 0.5; cursor: not-allowed; }
        .ob-spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ob-mail {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 14px; border-radius: 8px;
          border: 1px solid rgba(233,30,140,0.25);
          background: rgba(233,30,140,0.08);
          color: #e91e8c; font-size: 12px; font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
        }
        .ob-mail:hover { background: rgba(233,30,140,0.15); }

        /* Full page overlay for severe cases */
        .ob-overlay {
          background: rgba(13,8,16,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 32px 24px; text-align: center;
        }
        .ob-overlay-icon { font-size: 52px; margin-bottom: 16px; opacity: 0.6; }
        .ob-overlay-title { font-size: 20px; font-weight: 700; color: #f5f0ff; margin-bottom: 8px; }
        .ob-overlay-desc  { font-size: 14px; color: rgba(245,240,255,0.4); line-height: 1.7; max-width: 420px; margin: 0 auto 24px; }
        .ob-overlay-desc a { color: #e91e8c; text-decoration: none; }

        .ob-overlay-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .ob-overlay-btn {
          padding: 11px 24px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 7px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(233,30,140,0.3);
        }
        .ob-overlay-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .ob-overlay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ob-overlay-link {
          padding: 11px 20px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(245,240,255,0.5); font-size: 13px; font-weight: 500;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.15s; font-family: inherit;
        }
        .ob-overlay-link:hover { border-color: rgba(233,30,140,0.3); color: #f5f0ff; }

        .ob-last-checked {
          font-size: 10px; color: rgba(245,240,255,0.2);
          margin-top: 16px; letter-spacing: 0.05em;
        }
      `}</style>

      <div className="ob-wrap">
        {/* ── Top bar (always shown) ── */}
        <div className={`ob-bar ${status}`} style={{ position:"relative" }}>
          <div className={`ob-progress ${status}`} />

          <div className="ob-left">
            <div className={`ob-icon ${status}`}>
              {isOffline ? "📵" : "⚡"}
            </div>
            <div className="ob-text">
              <div className="ob-title">
                {isOffline
                  ? "You're offline"
                  : "Server is unreachable"}
              </div>
              <div className="ob-sub">
                {isOffline
                  ? "Check your internet connection."
                  : <>We're facing some issues. We'll recover fast. If urgent, <a href={`mailto:hello@pilupoo.com?subject=Server Down Report&body=${mailBody}`}>email us</a>.</>
                }
              </div>
            </div>
          </div>

          <div className="ob-right">
            <button
              className="ob-retry"
              onClick={handleRetry}
              disabled={retrying}
            >
              <span className={retrying ? "ob-spin" : ""}>↺</span>
              {retrying ? "Checking..." : "Retry"}
            </button>
            <a
              className="ob-mail"
              href={`mailto:hello@pilupoo.com?subject=Connectivity Issue&body=${mailBody}`}
            >
              ✉ Report
            </a>
          </div>
        </div>

        {/* ── Full overlay only for server down (serious) ── */}
        {isServerDown && (
          <div className="ob-overlay">
            <div className="ob-overlay-icon">🔧</div>
            <h2 className="ob-overlay-title">We're facing some issues</h2>
            <p className="ob-overlay-desc">
              Pilupoo's servers are temporarily unreachable. Your data is safe and
              no invites have been lost. We'll recover fast.
              If this is urgent, <a href={`mailto:hello@pilupoo.com?subject=Server Down Report&body=${mailBody}`}>email us at hello@pilupoo.com</a> and we'll respond immediately.
            </p>
            <div className="ob-overlay-actions">
              <button
                className="ob-overlay-btn"
                onClick={handleRetry}
                disabled={retrying}
              >
                <span className={retrying ? "ob-spin" : ""}>↺</span>
                {retrying ? "Checking..." : "Check Again"}
              </button>
              <a
                className="ob-overlay-link"
                href={`mailto:hello@pilupoo.com?subject=Server Down&body=${mailBody}`}
              >
                ✉ Email Support
              </a>
            </div>
            {lastChecked && (
              <div className="ob-last-checked">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
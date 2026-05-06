"use client";

import { useEffect, useRef, useState } from "react";
import { Notification } from "@/context/NotificationContext";

interface Props {
  notifications: Notification[];
}

const DURATION = 4000; // ms each toast lives

const CONFIG = {
  success: {
    icon:       "✓",
    iconBg:     "rgba(52,211,153,0.15)",
    iconColor:  "#34d399",
    border:     "rgba(52,211,153,0.2)",
    progress:   "linear-gradient(90deg, #34d399, #10b981)",
    glow:       "rgba(52,211,153,0.08)",
    label:      "Success",
  },
  error: {
    icon:       "✕",
    iconBg:     "rgba(248,113,113,0.15)",
    iconColor:  "#f87171",
    border:     "rgba(248,113,113,0.2)",
    progress:   "linear-gradient(90deg, #f87171, #ef4444)",
    glow:       "rgba(248,113,113,0.08)",
    label:      "Error",
  },
  info: {
    icon:       "ℹ",
    iconBg:     "rgba(147,197,253,0.15)",
    iconColor:  "#93c5fd",
    border:     "rgba(147,197,253,0.2)",
    progress:   "linear-gradient(90deg, #93c5fd, #3b82f6)",
    glow:       "rgba(147,197,253,0.08)",
    label:      "Info",
  },
  warning: {
    icon:       "⚠",
    iconBg:     "rgba(251,191,36,0.15)",
    iconColor:  "#fbbf24",
    border:     "rgba(251,191,36,0.2)",
    progress:   "linear-gradient(90deg, #fbbf24, #f59e0b)",
    glow:       "rgba(251,191,36,0.08)",
    label:      "Warning",
  },
} as const;

// ── Single toast ─────────────────────────────────────────
function Toast({
  notification,
  index,
  onDismiss,
}: {
  notification: Notification;
  index: number;
  onDismiss: (id: number) => void;
}) {
  const cfg            = CONFIG[notification.type as keyof typeof CONFIG] ?? CONFIG.info;
  const [width, setWidth] = useState(100);   // progress bar %
  const [exiting, setExiting] = useState(false);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt      = useRef(Date.now());
  const remaining      = useRef(DURATION);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      const pct     = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setWidth(pct);
      if (pct <= 0) clearInterval(intervalRef.current!);
    }, 50);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    remaining.current = Math.max(0, DURATION - (Date.now() - startedAt.current));
  };

  const resumeTimer = () => {
    startedAt.current = Date.now() - (DURATION - remaining.current);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 280);
  };

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform: translateX(110%) scale(0.92); }
          to   { opacity:1; transform: translateX(0)    scale(1);    }
        }
        @keyframes toastOut {
          from { opacity:1; transform: translateX(0)    scale(1);    max-height:100px; margin-bottom:8px; }
          to   { opacity:0; transform: translateX(110%) scale(0.92); max-height:0;     margin-bottom:0;   }
        }
        .toast {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 300px;
          max-width: 380px;
          padding: 14px 14px 0 14px;
          border-radius: 16px;
          border: 1px solid;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          background: rgba(13,8,16,0.92);
          transition: transform 0.15s, box-shadow 0.15s;
          animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .toast:hover { transform: scale(1.015); }
        .toast.exiting {
          animation: toastOut 0.28s ease forwards;
          pointer-events: none;
        }
        .toast-icon-wrap {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; flex-shrink: 0;
          margin-top: 1px;
        }
        .toast-body { flex: 1; min-width: 0; padding-bottom: 14px; }
        .toast-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 3px;
        }
        .toast-msg {
          font-size: 13px; font-weight: 500;
          color: rgba(245,240,255,0.85);
          line-height: 1.45;
          word-break: break-word;
        }
        .toast-close {
          width: 22px; height: 22px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: rgba(245,240,255,0.3);
          background: rgba(255,255,255,0.05);
          transition: all 0.15s; flex-shrink: 0; margin-top: 1px;
          border: none; cursor: pointer;
        }
        .toast-close:hover { background: rgba(255,255,255,0.12); color: rgba(245,240,255,0.7); }
        .toast-progress {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(255,255,255,0.06);
        }
        .toast-progress-fill {
          height: 100%; border-radius: 0 2px 2px 0;
          transition: width 50ms linear;
        }
      `}</style>

      <div
        className={`toast ${exiting ? "exiting" : ""}`}
        style={{
          borderColor: cfg.border,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}, inset 0 0 40px ${cfg.glow}`,
          animationDelay: `${index * 60}ms`,
        }}
        onClick={handleDismiss}
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        {/* Icon */}
        <div
          className="toast-icon-wrap"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
        >
          {cfg.icon}
        </div>

        {/* Body */}
        <div className="toast-body">
          <div className="toast-label" style={{ color: cfg.iconColor }}>
            {cfg.label}
          </div>
          <div className="toast-msg">{notification.message}</div>
        </div>

        {/* Close */}
        <button className="toast-close" onClick={handleDismiss}>✕</button>

        {/* Progress bar */}
        <div className="toast-progress">
          <div
            className="toast-progress-fill"
            style={{ width: `${width}%`, background: cfg.progress }}
          />
        </div>
      </div>
    </>
  );
}

// ── Container ─────────────────────────────────────────────
const NotificationContainer = ({ notifications }: Props) => {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const handleDismiss = (id: number) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  const visible = notifications.filter(n => !dismissed.has(n.id));

  if (visible.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .toast-container {
          position: fixed;
          top: 80px;        /* below your 62px header */
          right: 20px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
        }
        .toast-container > * { pointer-events: all; }

        /* Stack effect — slightly scale down older ones */
        .toast-container > *:nth-child(2) { transform: scale(0.97) translateX(4px); opacity: 0.9; }
        .toast-container > *:nth-child(3) { transform: scale(0.94) translateX(8px); opacity: 0.75; }
        .toast-container > *:nth-child(n+4) { opacity: 0; pointer-events: none; }

        @media (max-width: 480px) {
          .toast-container {
            right: 10px; left: 10px;
          }
          .toast { min-width: unset; max-width: unset; width: 100%; }
        }
      `}</style>

      <div className="toast-container">
        {visible.slice(0, 5).map((n, i) => (
          <Toast
            key={n.id}
            notification={n}
            index={i}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </>
  );
};

export default NotificationContainer;
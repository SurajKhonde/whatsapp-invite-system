"use client";

import { useEffect, useRef, useState } from "react";
import { Notification } from "@/context/NotificationContext";
import styles from "./notification.module.css";

interface Props {
  notifications: Notification[];
}

const DURATION = 4000; // ms each toast lives

const CONFIG = {
  success: {
    icon: "✓",
    iconBg: "rgba(52,211,153,0.15)",
    iconColor: "#34d399",
    border: "rgba(52,211,153,0.2)",
    progress: "linear-gradient(90deg, #34d399, #10b981)",
    glow: "rgba(52,211,153,0.08)",
    label: "Success",
  },
  error: {
    icon: "✕",
    iconBg: "rgba(248,113,113,0.15)",
    iconColor: "#f87171",
    border: "rgba(248,113,113,0.2)",
    progress: "linear-gradient(90deg, #f87171, #ef4444)",
    glow: "rgba(248,113,113,0.08)",
    label: "Error",
  },
  info: {
    icon: "ℹ",
    iconBg: "rgba(147,197,253,0.15)",
    iconColor: "#93c5fd",
    border: "rgba(147,197,253,0.2)",
    progress: "linear-gradient(90deg, #93c5fd, #3b82f6)",
    glow: "rgba(147,197,253,0.08)",
    label: "Info",
  },
  warning: {
    icon: "⚠",
    iconBg: "rgba(251,191,36,0.15)",
    iconColor: "#fbbf24",
    border: "rgba(251,191,36,0.2)",
    progress: "linear-gradient(90deg, #fbbf24, #f59e0b)",
    glow: "rgba(251,191,36,0.08)",
    label: "Warning",
  },
} as const;

// Single toast
function Toast({
  notification,
  index,
  onDismiss,
}: {
  notification: Notification;
  index: number;
  onDismiss: (id: number) => void;
}) {
  const cfg = CONFIG[notification.type as keyof typeof CONFIG] ?? CONFIG.info;
  const [width, setWidth] = useState(100);
  const [exiting, setExiting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(Date.now());
  const remaining = useRef(DURATION);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 280);
  };

  return (
    <div
      className={`${styles.toast} ${exiting ? styles.toastExiting : ""}`}
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
      <div className={styles.iconWrap} style={{ background: cfg.iconBg, color: cfg.iconColor }}>
        {cfg.icon}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.label} style={{ color: cfg.iconColor }}>
          {cfg.label}
        </div>
        <div className={styles.message}>{notification.message}</div>
      </div>

      {/* Close */}
      <button className={styles.closeBtn} onClick={handleDismiss}>
        ✕
      </button>

      {/* Progress bar */}
      <div className={styles.progress}>
        <div
          className={styles.progressFill}
          style={{ width: `${width}%`, background: cfg.progress }}
        />
      </div>
    </div>
  );
}

// Container
const NotificationContainer = ({ notifications }: Props) => {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const handleDismiss = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visible = notifications.filter((n) => !dismissed.has(n.id));

  if (visible.length === 0) return null;

  return (
    <div className={styles.container}>
      {visible.slice(0, 5).map((n, i) => (
        <Toast key={n.id} notification={n} index={i} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};

export default NotificationContainer;
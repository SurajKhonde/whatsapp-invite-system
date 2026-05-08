"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./offline-banner.module.css";

type Status = "online" | "offline" | "server-down";

export default function OfflineBanner() {
  const [status, setStatus] = useState<Status>("online");
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkServer = useCallback(async () => {
    try {
      const res = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
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

  useEffect(() => {
    const goOffline = () => {
      setStatus("offline");
      setVisible(true);
    };
    const goOnline = () => {
      checkServer();
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [checkServer]);

  useEffect(() => {
    if (status === "online") return;
    const interval = setInterval(checkServer, 30_000);
    return () => clearInterval(interval);
  }, [status, checkServer]);

  useEffect(() => {
    checkServer();
  }, [checkServer]);

  const handleRetry = async () => {
    setRetrying(true);
    await checkServer();
    setRetrying(false);
  };

  if (!visible) return null;

  const isOffline = status === "offline";
  const isServerDown = status === "server-down";

  const mailBody = encodeURIComponent(
    `Hi Pilupoo Support,\n\nI'm experiencing connectivity issues on the app.\n\nStatus: ${status}\nTime: ${new Date().toISOString()}\nPage: ${typeof window !== "undefined" ? window.location.href : ""}\n\nPlease help!`
  );

  return (
    <div className={styles.wrap}>
      {/* Top bar */}
      <div className={`${styles.bar} ${styles[status]}`}>
        <div className={`${styles.progress} ${styles[status]}`} />

        <div className={styles.left}>
          <div className={`${styles.icon} ${styles[status]}`}>
            {isOffline ? "📵" : "⚡"}
          </div>
          <div className={styles.text}>
            <div className={styles.title}>
              {isOffline ? "You're offline" : "Server is unreachable"}
            </div>
            <div className={styles.sub}>
              {isOffline ? (
                "Check your internet connection."
              ) : (
                <>
                  We're facing some issues. We'll recover fast. If urgent,{" "}
                  
                    href={`mailto:hello@pilooopu.shop?subject=Server Down Report&body=${mailBody}`}
                  <a>
                    email us
                  </a>
                  .
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <button className={styles.retry} onClick={handleRetry} disabled={retrying}>
            <span className={retrying ? styles.spin : ""}>↺</span>
            {retrying ? "Checking..." : "Retry"}
          </button>
          <a
            className={styles.mail}
            href={`mailto:hello@pilooopu.shop?subject=Connectivity Issue&body=${mailBody}`}
          >
            ✉ Report
          </a>
        </div>
      </div>

      {/* Full overlay for server down */}
      {isServerDown && (
        <div className={styles.overlay}>
          <div className={styles.overlayIcon}>🔧</div>
          <h2 className={styles.overlayTitle}>We're facing some issues</h2>
          <p className={styles.overlayDesc}>
            Pilupoo's servers are temporarily unreachable. Your data is safe and no invites have
            been lost. We'll recover fast. If this is urgent,{" "}
            <a href={`mailto:hello@pilooopu.com?subject=Server Down Report&body=${mailBody}`}>
              email us at hello@pilooopoo.com
            </a>{" "}
            and we'll respond immediately.
          </p>
          <div className={styles.overlayActions}>
            <button className={styles.overlayBtn} onClick={handleRetry} disabled={retrying}>
              <span className={retrying ? styles.spin : ""}>↺</span>
              {retrying ? "Checking..." : "Check Again"}
            </button>
            <a
              className={styles.overlayLink}
              href={`mailto:hello@pilooopu.shop?subject=Server Down&body=${mailBody}`}
            >
              ✉ Email Support
            </a>
          </div>
          {lastChecked && (
            <div className={styles.lastChecked}>
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
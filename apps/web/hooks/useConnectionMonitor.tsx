
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ConnectionState = "connected" | "disconnected" | "reconnecting";

// ─── Singleton event bus ───────────────────────────────────────────────────
const listeners = new Set<(state: ConnectionState) => void>();
let networkFailCount = 0;
const FAILURES_BEFORE_OFFLINE = 2;

export function notifyRequestSuccess() {
  networkFailCount = 0;
  listeners.forEach((fn) => fn("connected"));
}

export function notifyRequestFailure(isNetworkError: boolean) {
  if (!isNetworkError) return;
  networkFailCount++;
  if (networkFailCount >= FAILURES_BEFORE_OFFLINE) {
    listeners.forEach((fn) => fn("disconnected"));
  }
}
// ──────────────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const HEALTH_URL = `${BACKEND_URL}/health`;
const POLL_INTERVAL = 8_000;
const TIMEOUT = 5_000;

export function useConnectionMonitor() {
  const [state, setState] = useState<ConnectionState>("connected");
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<ConnectionState>("connected");

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), TIMEOUT);
      const res = await fetch(HEALTH_URL, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(t);

      if (res.ok) {
        networkFailCount = 0;
        stateRef.current = "connected";
        setState("connected");
        stopPolling();
        window.location.reload();
      }
    } catch {
      // still down, keep polling
    }
  }, [stopPolling]);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(checkHealth, POLL_INTERVAL);
  }, [checkHealth]);

  // ── On mount: single health check so 304s don't leave us "offline" ──
  useEffect(() => {
    const checkOnMount = async () => {
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), TIMEOUT);
        const res = await fetch(HEALTH_URL, { cache: "no-store", signal: controller.signal });
        clearTimeout(t);
        if (res.ok) {
          networkFailCount = 0;
          stateRef.current = "connected";
          setState("connected");
        }
      } catch {
        // leave as connected — real API failures will trigger offline
      }
    };
    checkOnMount();
  }, []);

  // ── Listen to signals from baseQuery ──
  useEffect(() => {
    const handler = (newState: ConnectionState) => {
      if (newState === stateRef.current) return;
      stateRef.current = newState;
      setState(newState);

      if (newState === "disconnected") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // ── Browser online/offline events ──
  useEffect(() => {
    const onOffline = () => {
      stateRef.current = "disconnected";
      setState("disconnected");
      startPolling();
    };

    const onOnline = () => {
      stateRef.current = "reconnecting";
      setState("reconnecting");
      checkHealth();
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [startPolling, checkHealth]);

  return state;
}

export function ConnectionStatus() {
  const state = useConnectionMonitor();

  if (state === "connected") return null;

  return (
    <div className="statusBadge">
      {state === "reconnecting" ? (
        <><span className="statusDot statusDotSpinner" /><span className="statusLabel">Reconnecting…</span></>
      ) : (
        <><span className="statusDot statusDotOffline" /><span className="statusLabel">Offline</span></>
      )}
    </div>
  );
}

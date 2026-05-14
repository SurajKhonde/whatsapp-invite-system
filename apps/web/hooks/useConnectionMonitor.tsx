"use client";

import { useEffect, useState, useRef } from "react";

interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
}

export function useConnectionMonitor() {
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ;
  const HEALTH_CHECK_URL = `${BACKEND_URL}/health`;

  const HEALTH_CHECK_INTERVAL = 90_000;
  const HEALTH_CHECK_TIMEOUT = 3_000;
  const MAX_FAILURES = 3;

  const checkHealth = async () => {
    setIsChecking(true);
    setCheckCount((prev) => prev + 1);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, HEALTH_CHECK_TIMEOUT);

      try {
        const response = await fetch(HEALTH_CHECK_URL, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          keepalive: false,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data: HealthStatus = await response.json();

          setIsConnected(true);
          setError(null);
          setFailCount(0);
          setLastCheck(new Date());

          return true;
        } else {
          throw new Error(`Server returned: ${response.status}`);
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error 
          ? err.message 
          : "Network error - No connection to backend";

      setFailCount((prev) => {
        const newFailCount = prev + 1;

        if (newFailCount >= MAX_FAILURES) {
          setIsConnected(false);
        }

        return newFailCount;
      });

      setError(errorMsg);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();

    const interval = setInterval(() => {
      checkHealth();
    }, HEALTH_CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setFailCount(0);
      checkHealth();
    };

    const handleOffline = () => {
      setIsConnected(false);
      setError("No internet connection");
      setFailCount(1);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setIsConnected(false);
      setError("No internet connection");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isConnected,
    error,
    isChecking,
    lastCheck,
    checkCount,
    failCount,
    manualCheck: checkHealth,
  };
}

export function ConnectionStatus() {
  const { isConnected, error, isChecking } = useConnectionMonitor();

  // Only show when there's an issue
  if (isConnected && !isChecking) {
    return null;
  }

  return (
    <div className="statusBadge">
      {isChecking ? (
        <>
          <span className="statusDot statusDotSpinner"></span>
          <span className="statusLabel">Checking</span>
        </>
      ) : isConnected ? (
        <>
          <span className="statusDot statusDotOnline"></span>
          <span className="statusLabel">Online</span>
        </>
      ) : (
        <>
          <span className="statusDot statusDotOffline"></span>
          <span className="statusLabel">Offline</span>
        </>
      )}
    </div>
  );
}

export function AutoReconnectRefresh() {
  const [wasDisconnected, setWasDisconnected] = useState(false);
  const { isConnected } = useConnectionMonitor();

  useEffect(() => {
    if (!isConnected) {
      setWasDisconnected(true);
    }

    if (wasDisconnected && isConnected) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [isConnected, wasDisconnected]);

  return null;
}

export async function apiWithRetry(
  url: string,
  options: RequestInit & { maxRetries?: number } = {}
) {
  const maxRetries = options.maxRetries || 3;
  let retries = 0;

  const attemptFetch = async (): Promise<Response> => {
    try {
      const fetchOptions = { ...options };
      delete (fetchOptions as any).maxRetries;

      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        return response;
      }

      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (err) {
      retries++;

      if (retries < maxRetries) {
        const delay = Math.pow(2, retries - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptFetch();
      }

      throw err;
    }
  };

  return attemptFetch();
}

export default ConnectionStatus;
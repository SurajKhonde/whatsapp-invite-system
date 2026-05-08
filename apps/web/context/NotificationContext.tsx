"use client";

// context/NotificationContext.tsx
// CHANGE: added "warning" to NotificationType

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import NotificationContainer from "@/components/ui/NotificationContainer";
import { setNotifier } from "@/utils/notify";

export type NotificationType = "success" | "error" | "info" | "warning"; // ✅ added warning

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4.3s (matches DURATION + exit animation)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4300);
  };

  useEffect(() => {
    setNotifier(addNotification);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
};

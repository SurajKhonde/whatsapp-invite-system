"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import NotificationContainer from "@/components/ui/NotificationContainer";
import { Notification, NotificationType } from "@/types/notification";

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: NotificationType = "info"
  ) => {
    const id = Date.now();

    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};
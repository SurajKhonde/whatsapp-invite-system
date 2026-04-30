"use client";

import { Notification } from "@/context/NotificationContext";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface Props {
  notifications: Notification[];
}

const typeConfig = {
  success: {
    bg: "bg-green-500/90",
    icon: <CheckCircle size={18} />,
  },
  error: {
    bg: "bg-red-500/90",
    icon: <XCircle size={18} />,
  },
  info: {
    bg: "bg-blue-500/90",
    icon: <Info size={18} />,
  },
};

const NotificationContainer = ({ notifications }: Props) => {
  return (
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3">
      {notifications.map((n) => {
        const config = typeConfig[n.type];

        return (
          <div
            key={n.id}
            className={`
              flex items-center gap-3
              px-4 py-3 min-w-[260px]
              rounded-xl text-white text-sm
              shadow-xl backdrop-blur-lg
              border border-white/20
              ${config.bg}
              
              animate-slideIn
            `}
          >
            {/* Icon */}
            <div className="opacity-90">{config.icon}</div>

            {/* Message */}
            <p className="flex-1">{n.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer;
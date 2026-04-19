import { Notification } from "@/types/notification";

interface Props {
  notifications: Notification[];
}

const NotificationContainer = ({ notifications }: Props) => {
  return (
    <div className="fixed top-5 right-5 space-y-3 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded shadow-lg text-white
            ${n.type === "success" && "bg-green-500"}
            ${n.type === "error" && "bg-red-500"}
            ${n.type === "info" && "bg-blue-500"}
          `}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

const notifColors = {
  success: "border-l-4 border-green-500 bg-green-50/70",
  error: "border-l-4 border-red-500 bg-red-50/70",
  info: "border-l-4 border-blue-500 bg-blue-50/70",
};

const NotificationList = () => {
const notifications = useAppStore((state) => state.notifications);

  // console.log(notifications)

  if (!notifications || notifications.length === 0) {
    return <p className="text-gray-500 p-4 text-center">No notifications yet</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notif) => (
        <motion.div
          key={notif.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`relative flex flex-col gap-2 mb-2 p-4 cursor-pointer rounded-xl
          ${notifColors[notif.type || "info"]}
          ${notif.isRead ? "opacity-60" : ""}`}
        >
          <span
            className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full
            ${notif.isRead ? "bg-gray-200 text-gray-600" : "bg-blue-100 text-blue-600"}`}
          >
            {notif.isRead ? "Read" : "Unread"}
          </span>

          <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
          <p className="text-gray-700 text-xs line-clamp-2">{notif.message}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationList;
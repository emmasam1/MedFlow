import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { motion } from "framer-motion";

const Notification = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { notifications, removeNotification } = useStore();

  console.log(id)

  // Find the notification
  const notif = notifications.find((n) => n.id.toString() === id);

  if (!notif) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-500 text-lg">Notification not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 font-semibold hover:underline transition"
        >
          &larr; Back
        </button>

        {/* Notification Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4
            border-green-500/0
            hover:shadow-xl transition cursor-pointer"
        >
          {notif.title && (
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {notif.title}
            </h1>
          )}
          <p className="text-gray-700 mb-4">{notif.message}</p>

          {notif.time && (
            <p className="text-gray-400 text-sm">Time: {notif.time}</p>
          )}

          {notif.type && (
            <p className="text-gray-500 text-sm mt-2">Type: {notif.type}</p>
          )}

          {/* Remove Notification */}
          <button
            onClick={() => {
              removeNotification(notif.id);
              navigate(-1);
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete Notification
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Notification;

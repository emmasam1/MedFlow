import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { motion } from "framer-motion";
import { RiArrowLeftLine, RiTimeLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

const Notification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications } = useStore();

  const notif = notifications.find((n) => n.id.toString() === id);

  if (!notif) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
          <p className="text-gray-500 text-lg font-medium">
            Notification not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition mb-6 cursor-pointer"
        >
          <AiOutlineClose size={18} />
          Close
        </button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-100"
        >
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {notif.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                {notif.time && (
                  <div className="flex items-center gap-1">
                    <RiTimeLine size={14} />
                    {notif.time}
                  </div>
                )}

                {notif.type && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                    {notif.type}
                  </span>
                )}
              </div>
            </div>

            {/* Status Dot */}
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2 animate-pulse" />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-6" />

          {/* Message */}
          <div className="text-gray-700 leading-relaxed text-[15px]">
            {notif.message}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notification;

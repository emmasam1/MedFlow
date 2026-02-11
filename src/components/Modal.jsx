import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/store";

const Modal = ({ isOpen, onClose, children }) => {
  const { darkMode } = useStore();

  const bgColor = darkMode ? "bg-[#1a202c]" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const borderColor = darkMode ? "border border-gray-700" : "border border-gray-100";
  const closeColor = darkMode
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-400 hover:text-gray-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Wrapper */}
          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className={`relative w-full max-w-lg rounded-xl shadow-xl ${bgColor} ${textColor} ${borderColor}`}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 text-lg transition ${closeColor}`}
              >
                ✕
              </button>

              {/* Content */}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

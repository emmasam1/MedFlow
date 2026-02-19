import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/store";

const Modal = ({
  isOpen,
  onClose,
  children,
  title = "Modal Title",
  size = "lg",
}) => {
  const { darkMode } = useStore();

  const bgColor = darkMode ? "bg-[#1a202c]" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";

  const closeColor = darkMode
    ? "text-gray-400 hover:text-white"
    : "text-gray-400 hover:text-gray-600";

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-[1000] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Center Wrapper */}
          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Modal Box */}
            <div
              className={`relative w-full ${
                sizeClasses[size] || "max-w-lg"
              } max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${bgColor} ${textColor} ${borderColor} pointer-events-auto`}
            >
              {/* HEADER (Fixed) */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-inherit z-10">
                <h2 className="text-lg font-semibold">{title}</h2>

                <button
                  onClick={onClose}
                  className={`text-xl transition-colors cursor-pointer ${closeColor}`}
                >
                  ✕
                </button>
              </div>

              {/* BODY (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

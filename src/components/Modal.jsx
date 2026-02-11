// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useStore } from "../store/store";

// const Modal = ({ isOpen, onClose, children }) => {
//   const { darkMode } = useStore();

//   const bgColor = darkMode ? "bg-[#1a202c]" : "bg-white";
//   const textColor = darkMode ? "text-gray-100" : "text-gray-800";
//   const borderColor = darkMode ? "border border-gray-700" : "border border-gray-100";
//   const closeColor = darkMode
//     ? "text-gray-400 hover:text-gray-200"
//     : "text-gray-400 hover:text-gray-600";

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Overlay */}
//           <motion.div
//             className="fixed inset-0 bg-black/70 z-[1000]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />

//           {/* Modal Wrapper */}
//           <motion.div
//             className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//           >
//             <div
//               className={`relative w-full max-w-lg rounded-xl shadow-xl ${bgColor} ${textColor} ${borderColor}`}
//             >
//               {/* Close Button */}
//               <button
//                 onClick={onClose}
//                 className={`absolute top-4 right-4 text-lg transition ${closeColor}`}
//               >
//                 ✕
//               </button>

//               {/* Content */}
//               <div className="p-6">{children}</div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;


import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/store";

const Modal = ({ isOpen, onClose, children }) => {
  const { darkMode } = useStore();

  const bgColor = darkMode ? "bg-[#1a202c]" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";
  
  const closeColor = darkMode
    ? "text-gray-400 hover:text-white"
    : "text-gray-400 hover:text-gray-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 z-[1000] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className={`relative w-full max-w-lg rounded-2xl shadow-2xl border ${bgColor} ${textColor} ${borderColor} pointer-events-auto overflow-hidden`}
            >
              <button
                onClick={onClose}
                className={`absolute top-5 right-5 text-xl transition-colors z-[1002] cursor-pointer ${closeColor}`}
              >
                ✕
              </button>

              {/* Added 'dark' class here so Tailwind's dark: utilities work inside children */}
              <div className={`p-8 ${darkMode ? "dark bg-[#1a202c]" : "bg-white"}`}>
                <div className={`${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                   {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
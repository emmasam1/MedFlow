
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiExpandDiagonalLine,
  RiNotification3Line,
  RiUserLine,
  RiSettings3Line,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { useStore } from "../store/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const Topbar = () => {
  const { isSidebarOpen, toggleSidebar, topbarColor, isRTL, darkMode } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- Fullscreen Logic ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const isLightTopbar = topbarColor === "bg-white" || topbarColor === "bg-gray-50";
  const textColor = isLightTopbar
    ? darkMode
      ? "text-white"
      : "text-gray-800"
    : "text-white";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`h-[60px] fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 transition-all duration-300
        ${
          isRTL
            ? isSidebarOpen
              ? "lg:pr-[260px] pr-0"
              : "lg:pr-[80px] pr-0"
            : isSidebarOpen
            ? "lg:pl-[260px] pl-0"
            : "lg:pl-[80px] pl-0"
        }
        ${topbarColor} ${textColor} shadow-sm`}
    >
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-black/5 rounded-lg"
      >
        {isSidebarOpen ? (
          <RiMenuFoldLine size={22} />
        ) : (
          <RiMenuUnfoldLine size={22} />
        )}
      </button>

      <div className="flex items-center gap-6">
        {/* Fullscreen Toggle Icon */}
        <RiExpandDiagonalLine
          className="cursor-pointer hidden sm:block hover:opacity-80 transition-opacity"
          size={20}
          onClick={toggleFullscreen}
        />
        
        <div className="relative">
          <RiNotification3Line size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </div>

        {/* Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.div
            whileHover={{ backgroundColor: "#9DCEF8", color: "#000" }}
            transition={{ duration: 0.3 }}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer py-1 px-3 rounded-full"
          >
            <p className="text-sm font-bold hidden md:block">Zara Judge</p>
            <img
              src="https://i.pravatar.cc/150?u=ella"
              className="w-8 h-8 rounded-full"
              alt="profile"
            />
          </motion.div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200"
              >
                <Link
                  to="/user-profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-gray-800"
                >
                  <RiUserLine size={18} />
                  <span>Account</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-gray-800"
                >
                  <RiSettings3Line size={18} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => console.log("Logout clicked")}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-gray-800"
                >
                  <RiLogoutBoxRLine size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

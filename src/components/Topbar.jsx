import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiExpandDiagonalLine,
  RiNotification3Line,
  RiUserLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { useStore } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Notification from "./Notification";
import Time from "./Time";

const Topbar = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    topbarColor,
    isRTL,
    darkMode,
    notifications,
    removeAllNotifications,
  } = useStore();

  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    setProfileDropdown(false);
    navigate("/");
  };

  const isLightTopbar =
    topbarColor === "bg-white" || topbarColor === "bg-gray-50";
  const textColor = isLightTopbar
    ? darkMode
      ? "text-white"
      : "text-gray-800"
    : "text-white";

  return (
    <header
      className={`h-[60px] fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 transition-all duration-300
        ${isRTL ? (isSidebarOpen ? "lg:pr-[260px]" : "lg:pr-[80px]") : isSidebarOpen ? "lg:pl-[260px]" : "lg:pl-[80px]"}
        ${topbarColor} ${textColor} shadow-sm`}
    >
      <div className="flex items-center gap-5">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <RiMenuFoldLine size={22} />
          ) : (
            <RiMenuUnfoldLine size={22} />
          )}
        </button>

        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-gray-700 tracking-wide">
            Afternoon Shift
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Fullscreen */}
        <RiExpandDiagonalLine
          size={20}
          className="cursor-pointer hidden sm:block hover:opacity-80 transition-opacity"
          onClick={toggleFullscreen}
        />

        {/*Time*/}
        <Time />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-2 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={() => setNotifDropdown((prev) => !prev)}
            aria-label="Notifications"
          >
            <RiNotification3Line size={22} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-semibold">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl z-50 ring-1 ring-gray-100"
              >
                {notifications.length === 0 && (
                  <p className="p-4 text-gray-500 text-sm text-center">
                    No notifications
                  </p>
                )}

                {/* Wrap notifications with max-h only if needed */}
                {notifications.length > 0 && (
                  <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    {notifications.map((notif) => (
                      <Notification key={notif.id} notif={notif} />
                    ))}
                  </div>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={() => removeAllNotifications?.()}
                    className="w-full py-3 text-center text-blue-600 font-bold hover:bg-blue-50 transition-colors rounded-b-2xl"
                  >
                    Mark all as read
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.div
            whileHover={{ backgroundColor: "#9DCEF8", color: "#000" }}
            transition={{ duration: 0.3 }}
            onClick={() => setProfileDropdown((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer py-1 px-3 rounded-full"
          >
            <p className="text-sm font-bold hidden md:block">Zara Judge</p>
            <img
              src="https://i.pravatar.cc/150?u=ella"
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </motion.div>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200"
              >
                <Link
                  to="/user-profile"
                  onClick={() => setProfileDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-gray-800"
                >
                  <RiUserLine size={18} />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleLogout}
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

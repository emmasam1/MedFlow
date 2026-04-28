import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useStore } from "../store/store";
import {
  RiDashboardLine,
  RiUserHeartLine,
  RiCalendarCheckLine,
  RiSettings4Line,
  RiUser3Line,
  RiReceiptLine,
  RiStackLine,
  RiFileList3Line, 
  RiShoppingBag3Line, 
  RiTruckLine, 
  RiErrorWarningLine,
  RiCapsuleLine, 
  RiHistoryLine, 
  RiListCheck2, 
  RiHandCoinLine
} from "react-icons/ri";
import { FaUserClock } from "react-icons/fa";
import { useAppStore } from "../store/useAppStore";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, sidebarTheme, isRTL, darkMode } =
    useStore();

  const user = useAppStore((state) => state.user);

  const bgColor = sidebarTheme === "dark" ? "bg-slate-900" : "bg-white";
  const borderColor = darkMode ? "border-gray-800" : "border-gray-100";
  const titleColor = sidebarTheme === "dark" ? "text-white" : "text-slate-800";
  const nameColor =
    sidebarTheme === "dark" ? "text-gray-200" : "text-slate-700";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  // Define role-based routes dynamically
 const routes = [
    {
      to: "/dashboard",
      icon: <RiDashboardLine size={22} />,
      label: "Dashboard",
      roles: [
        "doctor",
        "record_officer",
        "finance_officer",
        "specialist",
        "lab_officer",
        "nurse",
        "admin",
        "pharmacist",
        "store_officer" // Added store officer access
      ],
    },
    {
      to: "/dashboard/users",
      icon: <RiUserHeartLine size={22} />,
      label: "Users",
      roles: ["admin"],
    },
    {
      to: "/dashboard/departments",
      icon: <RiStackLine size={22} />, 
      label: "Departments",
      roles: ["admin"],
    },
    {
      to: "/dashboard/shifts",
      icon: <FaUserClock size={22} />,
      label: "Shift Management",
      roles: ["admin"],
    },
    {
      to: "/dashboard/finance-admin",
      icon: <FaUserClock size={22} />,
      label: "Finance",
      roles: ["admin"],
    },
    {
      to: "/dashboard/appointment",
      icon: <RiCalendarCheckLine size={22} />,
      label: "Appointment",
      roles: ["record_officer", "specialist"],
    },
    {
      to: "/dashboard/queue",
      icon: <RiUser3Line size={22} />,
      label: "Queue",
      roles: ["record_officer", "doctor", "nurse", "lab_officer", "finance_officer", "pharmacist"],
    },
    {
      to: "/dashboard/patients",
      icon: <RiUserHeartLine size={22} />,
      label: "Patients",
      roles: ["record_officer"],
    },
    {
      to: "/dashboard/finance",
      icon: <RiSettings4Line size={22} />,
      label: "Finance",
      roles: ["finance_officer"],
    },
    {
      to: "/dashboard/transactions",
      icon: <RiReceiptLine size={22} />,
      label: "Transactions",
      roles: ["finance_officer"],
    },
    {
      to: "/dashboard/lab-requests",
      icon: <RiReceiptLine size={22} />,
      label: "Requests",
      roles: ["lab_officer"],
    },
    {
      to: "/dashboard/lab-results",
      icon: <RiReceiptLine size={22} />,
      label: "Results",
      roles: ["lab_officer"],
    },

    // ================= STORE OFFICER ROUTES =================
    {
      to: "/dashboard/inventory",
      icon: <RiStackLine size={22} />, 
      label: "Inventory",
      roles: ["store_officer", "admin"],
    },
    {
      to: "/dashboard/stock-requests",
      icon: <RiFileList3Line size={22} />, // Good for internal requisitions
      label: "Stock Requests",
      roles: ["store_officer", "nurse", "lab_officer"], // Nurse/Lab can request, Store handles
    },
    {
      to: "/dashboard/procurement",
      icon: <RiShoppingBag3Line size={22} />, 
      label: "Procurement",
      roles: ["store_officer", "admin"],
    },
    {
      to: "/dashboard/suppliers",
      icon: <RiTruckLine size={22} />, 
      label: "Suppliers",
      roles: ["store_officer"],
    },
    {
      to: "/dashboard/expiry-tracker",
      icon: <RiErrorWarningLine size={22} />, 
      label: "Expiry Tracker",
      roles: ["store_officer", "pharmacist"],
    },
    {
      to: "/dashboard/queue",
      icon: <RiListCheck2 size={22} />,
      label: "Dispensing Queue", // Pharmacist sees this instead of just "Queue"
      roles: ["pharmacist"],
    },
    {
      to: "/dashboard/drug-inventory",
      icon: <RiCapsuleLine size={22} />,
      label: "Drug Stock",
      roles: ["pharmacist", "store_officer"],
    },
    {
      to: "/dashboard/dispense-history",
      icon: <RiHistoryLine size={22} />,
      label: "Dispense Log",
      roles: ["pharmacist", "admin"],
    },
  ];

  // Filter routes based on current user's role
  const allowedRoutes = routes.filter((route) =>
    route.roles.includes(user?.role),
  );

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 260 : window.innerWidth >= 1024 ? 80 : 260,
        x:
          window.innerWidth < 1024 && !isSidebarOpen ? (isRTL ? 260 : -260) : 0,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`fixed top-0 h-screen z-50 overflow-hidden ${bgColor} ${borderColor} shadow-sm flex flex-col border-r ${
        isRTL ? "right-0" : "left-0"
      }`}
    >
      {/* Logo */}
      <div
        className={`h-17.5 flex items-center justify-center border-b ${borderColor} px-4`}
      >
        <div className="flex items-center gap-2">
          <div className="bg-[#6777ef] p-2 rounded-lg shadow-md">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {(isSidebarOpen || window.innerWidth < 1024) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xl font-bold tracking-tight ${titleColor}`}
            >
              MedFlow
            </motion.span>
          )}
        </div>
      </div>

      {/* Profile */}
      <div
        className={`flex flex-col items-center py-10 px-6 ${window.innerWidth >= 1024 && !isSidebarOpen && "py-8 px-2"}`}
      >
        <motion.div
        className="rounded-full overflow-hidden "
          animate={{
            width: isSidebarOpen || window.innerWidth < 1024 ? 85 : 50,
            height: isSidebarOpen || window.innerWidth < 1024 ? 85 : 50,
            borderRadius:
              isSidebarOpen || window.innerWidth < 1024 ? "5rem" : "5rem",
          }}
          // className="overflow-hidden border-4 border-slate-50 dark:border-gray-800 shadow-xl mb-4"
        >
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {(isSidebarOpen || window.innerWidth < 1024) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h4 className={`font-bold text-base ${nameColor}`}>
              {user?.firstName || "User"}
            </h4>
            <p className="text-[11px] uppercase font-bold text-[#6777ef] tracking-widest mt-1">
              {user?.role.replace("_", " ").toUpperCase()}
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <p
          className={`text-[10px] font-bold uppercase mb-4 px-2 tracking-widest ${sidebarTheme === "dark" ? "text-gray-500" : "text-gray-400"}`}
        >
          {isSidebarOpen || window.innerWidth < 1024 ? "Main Menu" : "•••"}
        </p>

        <div className="space-y-2">
          {allowedRoutes.map((route) => (
            <SidebarItem
              key={route.to}
              to={route.to}
              icon={route.icon}
              label={route.label}
              isOpen={isSidebarOpen}
              theme={sidebarTheme}
              onClick={handleLinkClick}
              isRTL={isRTL}
              end={route.to === "/dashboard"}
            />
          ))}
        </div>
      </nav>
    </motion.aside>
  );
};

const SidebarItem = ({
  to,
  icon,
  label,
  isOpen,
  theme,
  onClick,
  end = false,
  isRTL,
}) => {
  const isMobile = window.innerWidth < 1024;

  const activeStyles =
    theme === "dark"
      ? "bg-[#6777ef] text-white shadow-lg shadow-blue-900/20"
      : "bg-blue-50 text-[#6777ef] shadow-sm";

  return (
    <NavLink
      to={to}
      end={end} // <-- important for exact matching
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
        ${isActive ? activeStyles : "text-gray-500 hover:text-[#6777ef] hover:bg-gray-50 dark:hover:bg-gray-800/50"}`
      }
    >
      <div className="shrink-0">{icon}</div>
      {(isOpen || isMobile) && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold tracking-wide"
        >
          {label}
        </motion.span>
      )}
      {!isOpen && !isMobile && (
        <div
          className={`fixed ${isRTL ? "right-20" : "left-20"} bg-slate-800 text-white text-xs py-1.5 px-2.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100]`}
        >
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default Sidebar;

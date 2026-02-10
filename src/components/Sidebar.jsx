

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/store';
import { RiDashboardLine, RiUserHeartLine, RiCalendarCheckLine, RiSettings4Line } from 'react-icons/ri';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, sidebarTheme, isRTL, darkMode } = useStore();

  const bgColor = sidebarTheme === 'dark' ? 'bg-[#1a202c]' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';
  const titleColor = sidebarTheme === 'dark' ? 'text-white' : 'text-slate-800';
  const nameColor = sidebarTheme === 'dark' ? 'text-gray-200' : 'text-slate-700';

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarOpen ? 260 : (window.innerWidth >= 1024 ? 80 : 260),
        x: (window.innerWidth < 1024 && !isSidebarOpen) ? (isRTL ? 260 : -260) : 0,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed top-0 h-screen z-50 overflow-hidden border-r ${bgColor} ${borderColor} shadow-sm flex flex-col
        ${isRTL ? 'right-0' : 'left-0'}`}
    >
      {/* Brand Logo Section */}
      <div className={`h-[70px] flex items-center justify-center border-b ${borderColor} px-4`}>
        <div className="flex items-center gap-2">
          <div className="bg-[#6777ef] p-1.5 rounded-lg shrink-0 shadow-md shadow-blue-200">
            <span className="text-white font-bold text-xl leading-none">M</span>
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

      {/* User Profile Area */}
      <div className={`flex flex-col items-center py-10 px-6 ${(window.innerWidth >= 1024 && !isSidebarOpen) && 'py-8 px-2'}`}>
        <motion.div 
          animate={{ 
            width: (isSidebarOpen || window.innerWidth < 1024) ? 85 : 50, 
            height: (isSidebarOpen || window.innerWidth < 1024) ? 85 : 50,
            borderRadius: (isSidebarOpen || window.innerWidth < 1024) ? "1.25rem" : "0.75rem"
          }}
          className="relative overflow-hidden border-4 border-slate-50 dark:border-gray-800 shadow-xl mb-4"
        >
          <img src="https://i.pravatar.cc/150?u=sarah" alt="Admin" className="w-full h-full object-cover" />
        </motion.div>
        
        {(isSidebarOpen || window.innerWidth < 1024) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h4 className={`font-bold text-base ${nameColor}`}>Zara Judge</h4>
            <p className="text-[11px] uppercase font-extrabold text-[#6777ef] tracking-widest mt-1">Admin</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-2 overflow-y-auto no-scrollbar">
        <p className={`text-[10px] font-bold uppercase mb-4 px-2 tracking-widest ${sidebarTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {(isSidebarOpen || window.innerWidth < 1024) ? 'Main Menu' : '•••'}
        </p>
        
        <div className="space-y-2">
          <SidebarItem 
            to="/dashboard" 
            icon={<RiDashboardLine size={22} />} 
            label="Dashboard" 
            isOpen={isSidebarOpen} 
            theme={sidebarTheme}
            onClick={handleLinkClick}
          />
          <SidebarItem 
            to="/appointments" 
            icon={<RiCalendarCheckLine size={22} />} 
            label="Appointments" 
            isOpen={isSidebarOpen} 
            theme={sidebarTheme}
            onClick={handleLinkClick}
          />
          <SidebarItem 
            to="/doctors" 
            icon={<RiUserHeartLine size={22} />} 
            label="Doctors" 
            isOpen={isSidebarOpen} 
            theme={sidebarTheme}
            onClick={handleLinkClick}
          />
          <SidebarItem 
            to="/settings" 
            icon={<RiSettings4Line size={22} />} 
            label="Settings" 
            isOpen={isSidebarOpen} 
            theme={sidebarTheme}
            onClick={handleLinkClick}
          />
        </div>
      </nav>
    </motion.aside>
  );
};

// Standard Menu Item Component
const SidebarItem = ({ to, icon, label, isOpen, theme, onClick }) => {
  const isMobile = window.innerWidth < 1024;
  
  // Logic for switching styles based on the sidebar theme
  const getActiveStyles = () => {
    if (theme === 'dark') {
      return 'bg-[#6777ef] text-white shadow-lg shadow-blue-900/20';
    }
    return 'bg-blue-50 text-[#6777ef] shadow-sm';
  };

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all duration-300 group
        ${isActive 
          ? getActiveStyles() 
          : 'text-gray-400 hover:text-[#6777ef] hover:bg-gray-50 dark:hover:bg-gray-800/50'}
      `}
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
        <div className="fixed left-20 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100]">
            {label}
        </div>
      )}
    </NavLink>
  );
};

export default Sidebar;
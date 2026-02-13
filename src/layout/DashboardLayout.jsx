
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FiSettings, FiCheck } from "react-icons/fi";
import { useStore } from "../store/store";

const DashboardLayout = () => {
  const { 
    darkMode, setDarkMode, 
    isSidebarOpen, toggleSidebar,
    sidebarTheme, setSidebarTheme,
    topbarColor, setTopbarColor,
    isRTL, setIsRTL 
  } = useStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const pathName = location.pathname.split("/").filter(Boolean).pop() || "Dashboard";
  
  // Track previous width to only trigger toggle on actual breakpoint crossing
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasDesktop = prevWidth.current >= 1024;
      const isDesktop = currentWidth >= 1024;

      // Only force a toggle if we cross the breakpoint boundary
      if (wasDesktop && !isDesktop && isSidebarOpen) {
        // Moving from Desktop to Mobile: Hide sidebar
        toggleSidebar();
      } else if (!wasDesktop && isDesktop && !isSidebarOpen) {
        // Moving from Mobile to Desktop: Show sidebar
        toggleSidebar();
      }
      
      prevWidth.current = currentWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  const colorOptions = [
    { name: 'White', class: 'bg-white' },
    { name: 'Dark', class: 'bg-slate-900' },
    { name: 'Blue', class: 'bg-blue-600' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Purple', class: 'bg-purple-600' },
    { name: 'Cyan', class: 'bg-cyan-500' },
    { name: 'Green', class: 'bg-green-500' },
  ];

  return (
    <div className={darkMode ? "dark" : ""} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#111827]" : "bg-[#f0f4f8]"}`}>
        
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && window.innerWidth < 1024 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[45] lg:hidden"
            />
          )}
        </AnimatePresence>

        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          
          <main className={`flex-1 pt-24 pb-12 transition-all duration-300 
            ${isRTL 
                ? (isSidebarOpen ? "lg:pr-[260px] pr-0" : "lg:pr-[80px] pr-0") 
                : (isSidebarOpen ? "lg:pl-[260px] pl-0" : "lg:pl-[80px] pl-0")} px-4`}>
            
     

            <div className="px-4">
                <Outlet />
            </div>
          </main>
        </div>

        {/* Settings Gear */}
        <button 
          onClick={() => setShowSettings(true)}
          className={`fixed top-1/2 -translate-y-1/2 bg-[#6777ef] p-3 text-white shadow-2xl z-40 transition-all hover:scale-110
            ${isRTL ? 'left-0 rounded-r-2xl' : 'right-0 rounded-l-2xl'}`}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
            <FiSettings size={24} />
          </motion.div>
        </button>

        {/* Setting Panel Drawer */}
        <AnimatePresence>
          {showSettings && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
              />
              <motion.div 
                initial={{ x: isRTL ? -350 : 350 }} animate={{ x: 0 }} exit={{ x: isRTL ? -350 : 350 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed top-0 h-full w-[250px] shadow-2xl z-[60] p-6 overflow-y-auto
                    ${isRTL ? 'left-0' : 'right-0'}
                    ${darkMode ? 'bg-[#1a202c] text-white' : 'bg-white text-gray-800'}`}
              >
                <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Setting Panel</h3>
                    <button onClick={() => setShowSettings(false)} className="text-2xl hover:text-red-500">&times;</button>
                </div>

                <section className="mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Select Layout</p>
                    <div className="flex flex-col gap-5">
                      <ThemeOption label="Light" isActive={!darkMode} onClick={() => setDarkMode(false)} previewImg="/assets/light.png" />
                      <ThemeOption label="Dark" isActive={darkMode} onClick={() => setDarkMode(true)} previewImg="/assets/dark.png" />
                    </div>
                </section>

                <section className="mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Sidebar Menu Color</p>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setSidebarTheme('light')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${sidebarTheme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>
                          {sidebarTheme === 'light' && <FiCheck />} Light
                        </button>
                        <button onClick={() => setSidebarTheme('dark')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${sidebarTheme === 'dark' ? 'bg-black text-white shadow-sm' : 'text-gray-500'}`}>
                          {sidebarTheme === 'dark' && <FiCheck />} Dark
                        </button>
                    </div>
                </section>

                <section className="mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Color Theme</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                        {colorOptions.map((color) => (
                            <button 
                                key={color.name}
                                onClick={() => setTopbarColor(color.class)}
                                className={`${color.class} w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 relative ${topbarColor === color.class ? 'border-blue-500 ring-2 ring-blue-200 ring-offset-1' : 'border-gray-200'}`}
                            >
                                {topbarColor === color.class && <div className="bg-white rounded-full p-0.5 shadow-sm"><FiCheck className="text-blue-600" size={10} /></div>}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mb-8 pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">RTL Layout</p>
                        <div onClick={() => setIsRTL(!isRTL)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isRTL ? 'bg-blue-500' : 'bg-gray-300'}`}>
                            <motion.div animate={{ x: isRTL ? (isRTL ? -22 : 22) : 0 }} className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </section>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ThemeOption = ({ label, isActive, onClick, previewImg }) => (
    <div onClick={onClick} className="group cursor-pointer">
        <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-blue-500 scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200'}`}>
            <img src={previewImg} alt={label} className="w-full h-24 object-cover" />
            {isActive && <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center"><div className="bg-blue-600 text-white rounded-full p-1 shadow-lg border-2 border-white translate-y-2"><FiCheck size={14} /></div></div>}
        </div>
        <p className={`text-center mt-2 text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{label}</p>
    </div>
);

export default DashboardLayout;


import { RiMenuFoldLine, RiMenuUnfoldLine, RiExpandDiagonalLine, RiNotification3Line } from 'react-icons/ri';
import { useStore } from '../store/store';

const Topbar = () => {
  const { isSidebarOpen, toggleSidebar, topbarColor, isRTL, darkMode } = useStore();

  const isLightTopbar = topbarColor === 'bg-white' || topbarColor === 'bg-gray-50';
  const textColor = isLightTopbar ? (darkMode ? 'text-white' : 'text-gray-800') : 'text-white';

  return (
    <header className={`h-[60px] fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 transition-all duration-300
        ${isRTL 
          ? (isSidebarOpen ? 'lg:pr-[260px] pr-0' : 'lg:pr-[80px] pr-0') 
          : (isSidebarOpen ? 'lg:pl-[260px] pl-0' : 'lg:pl-[80px] pl-0')}
        ${topbarColor} ${textColor} shadow-sm`}>
      
      <button onClick={toggleSidebar} className="p-2 hover:bg-black/5 rounded-lg">
        {isSidebarOpen ? <RiMenuFoldLine size={22} /> : <RiMenuUnfoldLine size={22} />}
      </button>

      <div className="flex items-center gap-6">
        <RiExpandDiagonalLine className="cursor-pointer hidden sm:block" size={20} />
        <div className="relative">
            <RiNotification3Line size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
        </div>
        <div className="flex items-center gap-3 hover:bg-[#9DCEF8]! cursor-pointer py-1 px-3 rounded-full hover:text-black">
          <p className="text-sm font-bold hidden md:block">Zara Judge</p>
          <img src="https://i.pravatar.cc/150?u=ella" className="w-8 h-8 rounded-full" alt="profile" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
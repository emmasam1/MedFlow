
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      darkMode: false,
      isSidebarOpen: true,
      sidebarTheme: 'light',
      topbarColor: 'bg-white',
      isRTL: false,
      
      setDarkMode: (val) => set({ darkMode: val }),
      setSidebarTheme: (val) => set({ sidebarTheme: val }),
      setTopbarColor: (val) => set({ topbarColor: val }),
      setIsRTL: (val) => set({ isRTL: val }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    { name: 'cliniva-theme-settings' }
  )
);
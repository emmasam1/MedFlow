import React from "react";
import { motion } from "framer-motion";
import {
  LuCalendarCheck,
  LuCalendarX,
  LuUsers,
  LuUserPlus,
} from "react-icons/lu";
import { AiTwotoneAlert } from "react-icons/ai";
import { useStore } from "../store/store";

const icons = {
  purple: LuCalendarCheck,
  orange: LuCalendarX,
  blue: LuUsers,
  green: LuUserPlus,
  red: AiTwotoneAlert,
  indigo: LuCalendarCheck,
  emerald: LuCalendarCheck, // Added fallback keys if needed
};

const colors = {
  purple: {
    light: { card: "bg-[#E6D9FF]", icon: "bg-[#CFC0FF] text-purple-800" },
    dark: { card: "bg-[#2A2438]", icon: "bg-[#3A3153] text-purple-300" },
  },
  orange: {
    light: { card: "bg-[#FFE3CC]", icon: "bg-[#FFCAA3] text-orange-700" },
    dark: { card: "bg-[#3A2A1E]", icon: "bg-[#4A3426] text-orange-300" },
  },
  green: {
    light: { card: "bg-[#DFF3DF]", icon: "bg-[#BFE3C1] text-green-800" },
    dark: { card: "bg-[#1F3A2E]", icon: "bg-[#294C3C] text-green-300" },
  },
  emerald: { // Mapping emerald to green for safety
    light: { card: "bg-[#DFF3DF]", icon: "bg-[#BFE3C1] text-green-800" },
    dark: { card: "bg-[#1F3A2E]", icon: "bg-[#294C3C] text-green-300" },
  },
  blue: {
    light: { card: "bg-[#D9EDFF]", icon: "bg-[#BFDFFF] text-blue-800" },
    dark: { card: "bg-[#1E2F3F]", icon: "bg-[#2A435C] text-blue-300" },
  },
  red: {
    light: { card: "bg-[#FFD6D6]", icon: "bg-[#FFBABA] text-red-800" },
    dark: { card: "bg-[#3F1E1E]", icon: "bg-[#5C2A2A] text-red-300" },
  },
  indigo: {
    light: { card: "bg-[#E0E7FF]", icon: "bg-[#C7D2FE] text-indigo-800" },
    dark: { card: "bg-[#1E1B4B]", icon: "bg-[#312E81] text-indigo-300" },
  },
};

const StatCard = ({ title, value, color = "blue" }) => {
  const { darkMode } = useStore();
  
  // 1. Safe Fallbacks: Prevent "undefined" crashes
  const Icon = icons[color] || LuCalendarCheck;
  const theme = darkMode 
    ? (colors[color]?.dark || colors.blue.dark) 
    : (colors[color]?.light || colors.blue.light);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${theme.card} rounded-2xl p-5 py-7 flex justify-between items-center transition-colors duration-300 shadow-sm`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.icon}`}>
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className="text-right">
        <p className={`font-xs font-semibold capitalize tracking-wider ${darkMode ? "text-gray-400" : "text-black"}`}>
          {title}
        </p>
        <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
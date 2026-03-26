import { motion } from "framer-motion";
import {
  LuCalendarCheck,
  LuCalendarX,
  LuUsers,
  LuUserPlus, 
  // LuCalendarX
} from "react-icons/lu";
import { AiTwotoneAlert } from "react-icons/ai";
import { useStore } from "../store/store";

const icons = {
  purple: LuCalendarCheck,
  orange: LuCalendarX,
  blue: LuUsers,
  green: LuUserPlus,
  red: AiTwotoneAlert, 
};

const StatCard = ({ title, value, color }) => {
  const { darkMode } = useStore();
  const Icon = icons[color];

 const colors = {
  purple: {
    light: {
      card: "bg-[#E6D9FF]",       // darker than #F3EEFF
      icon: "bg-[#CFC0FF] text-purple-800", // darker icon color
    },
    dark: {
      card: "bg-[#2A2438]",
      icon: "bg-[#3A3153] text-purple-300",
    },
  },
  orange: {
    light: {
      card: "bg-[#FFE3CC]",       // darker than #FFF4EC
      icon: "bg-[#FFCAA3] text-orange-700", // darker icon color
    },
    dark: {
      card: "bg-[#3A2A1E]",
      icon: "bg-[#4A3426] text-orange-300",
    },
  },
  green: {
    light: {
      card: "bg-[#DFF3DF]",       // darker than #EAF7EF
      icon: "bg-[#BFE3C1] text-green-800",
    },
    dark: {
      card: "bg-[#1F3A2E]",
      icon: "bg-[#294C3C] text-green-300",
    },
  },
  blue: {
    light: {
      card: "bg-[#D9EDFF]",       // darker than #EDF6FF
      icon: "bg-[#BFDFFF] text-blue-800",
    },
    dark: {
      card: "bg-[#1E2F3F]",
      icon: "bg-[#2A435C] text-blue-300",
    },
  },
  red: {
    light: {
      card: "bg-[#FFD6D6]",       // darker than #FFEDED
      icon: "bg-[#FFBABA] text-red-800",
    },
    dark: {
      card: "bg-[#3F1E1E]",
      icon: "bg-[#5C2A2A] text-red-300",
    },
  },
};

  const theme = darkMode ? colors[color].dark : colors[color].light;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${theme.card} rounded-2xl p-5 py-7 flex justify-between items-center transition-colors duration-300`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.icon}`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;

import { motion } from "framer-motion";
import {
  LuCalendarCheck,
  LuCalendarX,
  LuUsers,
  LuUserPlus,
} from "react-icons/lu";
import { useStore } from "../store/store";

const icons = {
  purple: LuCalendarCheck,
  orange: LuCalendarX,
  blue: LuUsers,
  green: LuUserPlus,
};

const StatCard = ({ title, value, color }) => {
  const { darkMode } = useStore();
  const Icon = icons[color];

  const colors = {
    purple: {
      light: {
        card: "bg-[#F3EEFF]",
        icon: "bg-[#E0DAFF] text-purple-700",
      },
      dark: {
        card: "bg-[#2A2438]",
        icon: "bg-[#3A3153] text-purple-300",
      },
    },
    orange: {
      light: {
        card: "bg-[#FFF4EC]",
        icon: "bg-[#FFD9BE] text-orange-600",
      },
      dark: {
        card: "bg-[#3A2A1E]",
        icon: "bg-[#4A3426] text-orange-300",
      },
    },
    green: {
      light: {
        card: "bg-[#EAF7EF]",
        icon: "bg-[#CFE9D8] text-green-700",
      },
      dark: {
        card: "bg-[#1F3A2E]",
        icon: "bg-[#294C3C] text-green-300",
      },
    },
    blue: {
      light: {
        card: "bg-[#EDF6FF]",
        icon: "bg-[#CFE6FF] text-blue-700",
      },
      dark: {
        card: "bg-[#1E2F3F]",
        icon: "bg-[#2A435C] text-blue-300",
      },
    },
  };

  const theme = darkMode
    ? colors[color].dark
    : colors[color].light;

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
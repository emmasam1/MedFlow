import { motion } from "framer-motion";
import {
  LuCalendarCheck,
  LuCalendarX,
  LuUsers,
  LuUserPlus,
} from "react-icons/lu";

const colors = {
  purple: {
    card: "bg-[#BDACE4]",
    icon: "bg-[#E0DAFF] text-purple-700",
  },
  orange: {
    card: "bg-[#FFF4EC]",
    icon: "bg-[#FFD9BE] text-orange-600",
  },
  green: {
    card: "bg-[#ADD7B4]",
    icon: "bg-[#CFE9D8] text-green-700",
  },
  blue: {
    card: "bg-[#9DCEF8]",
    icon: "bg-[#CFE6FF] text-blue-700",
  },
};

const icons = {
  purple: LuCalendarCheck,
  orange: LuCalendarX,
  blue: LuUsers,
  green: LuUserPlus,
};

const StatCard = ({ title, value, color }) => {
  const theme = colors[color];
  const Icon = icons[color];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${theme.card} rounded-2xl p-5 py-7  flex justify-between items-center`}
    >
      {/* ICON */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.icon}`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      {/* TEXT */}
      <div className="text-right">
        <p className="text-sm text-black font-semibold">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;

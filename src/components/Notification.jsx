import { motion } from "framer-motion";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const notifColors = {
  success: "border-l-4 border-green-500 bg-green-50/70",
  error: "border-l-4 border-red-500 bg-red-50/70",
  info: "border-l-4 border-blue-500 bg-blue-50/70",
};

const Notification = ({ notif }) => {
//   const removeNotification = useStore((state) => state.removeNotification);
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/dashboard/notifications/${notif.id}`)}
      className={`flex flex-col gap-1 mb-2 p-4 cursor-pointer rounded-lg hover:bg-gray-100 transition-transform transform ${notifColors[notif.type]}`}
    >
      <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
      <p className="text-gray-700 text-xs line-clamp-2">{notif.message}</p>
      {notif.type === "action" && notif.buttonText && (
        <button className="mt-2 px-4 py-1 text-blue-600 border border-blue-400 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-200">
          {notif.buttonText}
        </button>
      )}
    </motion.div>
  );
};

export default Notification;

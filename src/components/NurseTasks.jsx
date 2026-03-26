import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";

const NurseTasks = () => {
  const { darkMode } = useStore();
  const { queue } = useAppStore(); // temp reuse for demo

  const tasks = queue || [];

  return (
    <div className={`rounded-2xl p-4 h-full ${darkMode ? "bg-[#1E2F3F]" : "bg-white"} shadow`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>Nurse Tasks</h3>
        <span className="text-xs text-gray-400">{tasks.length} tasks</span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No tasks available</p>
        ) : (
          tasks.map((task, index) => {
            const status = task.status?.toLowerCase();
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  darkMode ? "border-gray-700 bg-[#2A435C]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {task.patientName || "Patient"}
                  </p>
                  <p className="text-xs text-gray-400">{task.type || "Vitals Check"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === "done" ? "bg-green-100 text-green-600" :
                    status === "waiting" ? "bg-orange-100 text-orange-600" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {status || "pending"}
                  </span>
                  {status !== "done" && (
                    <button
                      className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => console.log("Mark as done", task)}
                    >
                      Done
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NurseTasks;
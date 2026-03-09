import React, { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";

const PatientQueue = () => {
  const { getQueue, queue } = useAppStore();
  const { darkMode } = useStore();

  /* 🎨 Theme Variables */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";
  const textPrimary = darkMode ? "text-white" : "text-slate-800";
  const textSecondary = darkMode ? "text-gray-400" : "text-slate-400";
  const hoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  /* Status styles using custom colors */
  const statusStyles = {
    waiting: darkMode
      ? "bg-[#f59e0b]/20 text-[#f59e0b]"
      : "bg-[#fef3c7] text-[#b45309]",
    "in-progress": darkMode
      ? "bg-[#3b82f6]/20 text-[#3b82f6]"
      : "bg-[#dbedff] text-[#1d4ed8]",
    done: darkMode
      ? "bg-[#10b981]/20 text-[#10b981]"
      : "bg-[#d1fae5] text-[#047857]",
    cancelled: darkMode
      ? "bg-[#ef4444]/20 text-[#ef4444]"
      : "bg-[#fee2e2] text-[#b91c1c]",
  };

  useEffect(() => {
    getQueue();
  }, []);

  const todayQueue = queue.slice(0, 5); // show only first 5 patients

  return (
    <div
      className={`${containerBg} rounded-xl shadow-sm border p-4 font-sans max-w-sm transition-colors duration-300`}
    >
      <h2 className={`text-sm font-bold mb-4 ${textPrimary}`}>Patient Queue</h2>

      {todayQueue.length === 0 ? (
        <p className={`${textSecondary} text-sm`}>No patients in queue</p>
      ) : (
        <ul className="space-y-3">
          {todayQueue.map((patient) => (
            <li
              key={patient.id}
              className={`flex justify-between items-center p-2 rounded-xl ${hoverBg} transition`}
            >
              <div>
                <p className={`font-semibold ${textPrimary}`}>
                  {patient.patientName}
                </p>
                <p className={`text-sm ${textSecondary}`}>{patient.reason}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  statusStyles[patient.status || "waiting"]
                }`}
              >
                {patient.status || "waiting"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientQueue;
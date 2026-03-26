import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/store";

ChartJS.register(ArcElement, Tooltip, Legend);

const PatientChart = () => {
  const { darkMode } = useStore();
  const [period, setPeriod] = useState("Daily");

  const chartDataMap = {
    Daily: [24.9, 21.8, 28.7, 24.6],
    Weekly: [180, 150, 210, 170],
    Monthly: [720, 650, 800, 700],
  };

  const statsMap = {
    Daily: ["320%", "280%", "370%", "317%"],
    Weekly: ["2,100%", "1,800%", "2,600%", "2,000%"],
    Monthly: ["8,500%", "7,500%", "9,000%", "8,200%"],
  };

  /* 🎨 Theme Variables */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";

  const textPrimary = darkMode ? "text-white" : "text-slate-800";
  const textSecondary = darkMode ? "text-gray-400" : "text-slate-400";
  const tabInactive = darkMode ? "text-gray-400" : "text-slate-400";
  const tabActive = darkMode
    ? "text-blue-400 bg-blue-900/30"
    : "text-blue-600 bg-blue-50";

  const chartBorderColor = darkMode ? "#1f2937" : "#ffffff";

  const data = {
    labels: ["Dengue", "Typhoid", "Malaria", "Cold"],
    datasets: [
      {
        data: chartDataMap[period],
        backgroundColor: ["#818cf8", "#d97706", "#374151", "#94a3b8"],
        borderWidth: 2,
        borderColor: chartBorderColor,
        cutout: "60%",
      },
    ],
  };

  const stats = [
    { label: "Dengue", value: statsMap[period][0], color: "bg-indigo-500" },
    { label: "Typhoid", value: statsMap[period][1], color: "bg-amber-600" },
    { label: "Malaria", value: statsMap[period][2], color: "bg-slate-700" },
    { label: "Cold", value: statsMap[period][3], color: "bg-slate-400" },
  ];

  return (
    <div
      className={`${containerBg} rounded-xl shadow-sm border p-4 font-sans transition-colors duration-300`}
    >
      {/* Title */}
      <h2 className={`text-sm font-bold mb-4 ${textPrimary}`}>
        Patient Chart
      </h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4 text-xs font-semibold">
        {["Daily", "Weekly", "Monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-2 py-1 rounded transition ${
              period === tab ? tabActive : tabInactive
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Chart */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Doughnut
              data={data}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xl font-bold ${textPrimary}`}>
                {chartDataMap[period].reduce((a, b) => a + b, 0)}
              </span>
              <span className={`text-xs ${textSecondary}`}>
                Total People
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2 justify-center"
              >
                <div
                  className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3"
                    />
                  </svg>
                </div>
                <div>
                  <p className={textSecondary}>{item.label}</p>
                  <p className={`font-bold ${textPrimary}`}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PatientChart;
import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/store";
import { useAppStore } from "../store/useAppStore";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const PatientChart = () => {
  const { darkMode } = useStore();
  const [period, setPeriod] = useState("Daily");

 const user = useAppStore((state) => state.user);
  const isNurse = user?.role?.toLowerCase() === "nurse";

   // Disease data (default users)
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

  // ✅ Vital data (for nurses)
  const vitalDataMap = {
    Daily: [72, 98, 120, 16],
    Weekly: [75, 97, 118, 18],
    Monthly: [70, 99, 122, 17],
  };

  /* =========================
     DYNAMIC LABELS
  ========================= */
  const labels = isNurse
    ? ["Heart Rate", "SpO2", "Blood Pressure", "Respiration"]
    : ["Dengue", "Typhoid", "Malaria", "Cold"];

  /* =========================
     THEME
  ========================= */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";

  const textPrimary = darkMode ? "text-white" : "text-slate-800";
  const textSecondary = darkMode ? "text-gray-400" : "text-slate-400";
  const tabInactive = darkMode ? "text-gray-400" : "text-slate-400";
  const tabActive = darkMode
    ? "text-blue-400 bg-blue-900/30"
    : "text-blue-600 bg-blue-50";

    const activeData = isNurse
    ? vitalDataMap[period]
    : chartDataMap[period];

      /* =========================
     STATS (LEGEND)
  ========================= */
  const stats = isNurse
    ? [
        {
          label: "Heart Rate",
          value: `${activeData[0]} bpm`,
          color: "bg-indigo-500",
        },
        {
          label: "SpO2",
          value: `${activeData[1]}%`,
          color: "bg-amber-600",
        },
        {
          label: "Blood Pressure",
          value: `${activeData[2]} mmHg`,
          color: "bg-slate-700",
        },
        {
          label: "Respiration",
          value: `${activeData[3]} rpm`,
          color: "bg-slate-400",
        },
      ]
    : [
        {
          label: "Dengue",
          value: statsMap[period][0],
          color: "bg-indigo-500",
        },
        {
          label: "Typhoid",
          value: statsMap[period][1],
          color: "bg-amber-600",
        },
        {
          label: "Malaria",
          value: statsMap[period][2],
          color: "bg-slate-700",
        },
        {
          label: "Cold",
          value: statsMap[period][3],
          color: "bg-slate-400",
        },
      ];

  const chartBorderColor = darkMode ? "#1f2937" : "#ffffff";
   const total = activeData.reduce((a, b) => a + b, 0);

  /* =========================
     VITAL DATA (FOR NURSES)
  ========================= */
  const vitalTrends = {
    Daily: [72, 75, 78, 76, 80, 77],
    Weekly: [70, 72, 75, 78, 76, 79, 81],
    Monthly: [68, 70, 72, 74, 76, 78, 80],
  };

  const vitalStats = {
    heartRate: 78,
    spo2: 96,
    bp: 120,
    resp: 18,
  };

  /* =========================
     STATUS COLORS
  ========================= */
  const getStatus = (type, value) => {
    switch (type) {
      case "heartRate":
        if (value < 60 || value > 100) return "text-red-500";
        return "text-green-500";
      case "spo2":
        if (value < 92) return "text-red-500";
        if (value < 95) return "text-yellow-500";
        return "text-green-500";
      case "bp":
        if (value > 140) return "text-red-500";
        return "text-green-500";
      case "resp":
        if (value < 12 || value > 20) return "text-red-500";
        return "text-green-500";
      default:
        return "";
    }
  };

  /* =========================
     NORMAL USERS DATA
  ========================= */
  // const chartDataMap = {
  //   Daily: [24.9, 21.8, 28.7, 24.6],
  //   Weekly: [180, 150, 210, 170],
  //   Monthly: [720, 650, 800, 700],
  // };

  const data = {
    labels: ["Dengue", "Typhoid", "Malaria", "Cold"],
    datasets: [
      {
        data: chartDataMap[period],
        backgroundColor: ["#818cf8", "#d97706", "#374151", "#94a3b8"],
        cutout: "60%",
      },
    ],
  };

  /* =========================
     LINE CHART (NURSE)
  ========================= */
  const lineData = {
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "Heart Rate",
        data: vitalTrends[period],
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  /* =========================
     THEME
  ========================= */
  // const containerBg = darkMode
  //   ? "bg-[#1a202c] border-gray-700"
  //   : "bg-white border-gray-100";

  // const textPrimary = darkMode ? "text-white" : "text-slate-800";
  // const textSecondary = darkMode ? "text-gray-400" : "text-slate-400";

  return (
    <div className={`${containerBg} rounded-xl p-4`}>
      <h2 className={`font-bold mb-4 ${textPrimary}`}>
        {isNurse ? "Patient Vital Monitor" : "Patient Chart"}
      </h2>

      {/* =========================
         NURSE VIEW
      ========================= */}
      {isNurse ? (
        <>
          {/* Vital Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              ❤️ Heart Rate
              <p className={`text-lg font-bold ${getStatus("heartRate", vitalStats.heartRate)}`}>
                {vitalStats.heartRate} bpm
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              🫁 SpO2
              <p className={`text-lg font-bold ${getStatus("spo2", vitalStats.spo2)}`}>
                {vitalStats.spo2}%
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              🩸 Blood Pressure
              <p className={`text-lg font-bold ${getStatus("bp", vitalStats.bp)}`}>
                {vitalStats.bp} mmHg
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              🌬️ Respiration
              <p className={`text-lg font-bold ${getStatus("resp", vitalStats.resp)}`}>
                {vitalStats.resp} rpm
              </p>
            </div>
          </div>

          {/* Line Chart */}
          <Line
            data={lineData}
            options={{
              plugins: { legend: { display: false } },
              responsive: true,
            }}
          />
        </>
      ) : (
      <div
      // className={`${containerBg} rounded-xl shadow-sm border p-4 font-sans transition-colors duration-300`}
    >
      {/* Title */}
      {/* <h2 className={`text-sm font-bold mb-4 ${textPrimary}`}>
        {isNurse ? "Patient Vital Chart" : "Patient Chart"}
      </h2> */}

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
                {total}
              </span>
              <span className={`text-xs ${textSecondary}`}>
                {isNurse ? "Vitals Summary" : "Total People"}
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
      )}
    </div>
  );
};

export default PatientChart;
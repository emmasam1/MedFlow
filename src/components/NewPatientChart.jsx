import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const NewPatientChart = () => {
  const { patients } = useAppStore();
  const { darkMode } = useStore();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [startIndex, setStartIndex] = useState(Math.max(today.getDate() - 3, 0));
  const [chartData, setChartData] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    weekday: new Date(year, month, i + 1).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    date: i + 1,
  }));

  const VISIBLE_DAYS = 5;

  // ✅ FIXED: REAL TIME EXTRACTION (no more random)
  const computeChartData = (day) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const patientsOfDay = patients.filter((p) => p.regDate === dayStr);

    const hourly = Array(24).fill(0);

    patientsOfDay.forEach((patient) => {
      if (patient.regTime) {
        const hour = parseInt(patient.regTime.split(":")[0], 10);
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
          hourly[hour] += 1;
        }
      }
    });

    setChartData(hourly);
  };

  // useEffect(() => {
  //   computeChartData(selectedDay);
  // }, [patients, selectedDay]);

  const selectDay = (day) => {
    if (day < 1 || day > daysInMonth) return;
    setSelectedDay(day);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(year, month + direction, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
    setStartIndex(0);
  };

  // ✅ Theme Based On Dark Mode
  const primary = "#3b82f6";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const subText = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";

  const lineData = {
    labels: Array.from({ length: 24 }, (_, i) =>
      `${i.toString().padStart(2, "0")}:00`
    ),
    datasets: [
      {
        label: `New Patients`,
        data: chartData,
        borderColor: primary,
        backgroundColor: darkMode
          ? "rgba(59,130,246,0.25)"
          : "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: primary,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? "#111827" : "#ffffff",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: primary,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      x: {
        ticks: { color: textColor },
        grid: { display: false },
      },
    },
    maintainAspectRatio: false,
  };

  const totalNewPatients = chartData.reduce((acc, val) => acc + val, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl shadow-lg p-4 border flex flex-col"
      style={{
        backgroundColor: cardBg,
        borderColor: gridColor,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-bold text-sm"
          style={{ color: textColor }}
        >
          New Patients
        </h2>

        <div className="flex items-center gap-3 px-3 py-1 rounded-full">
          <button onClick={() => changeMonth(-1)}>
            <FiChevronLeft style={{ color: subText }} size={18} />
          </button>

          <span
            className="text-sm font-medium text-center"
            style={{ color: subText }}
          >
            {monthNames[month]} {year}
          </span>

          <button onClick={() => changeMonth(1)}>
            <FiChevronRight style={{ color: subText }} size={18} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[220px] mb-4">
        <Line data={lineData} options={options} />
      </div>

      {/* Total */}
      <div
        className="font-bold text-center py-2 rounded-xl"
        style={{
          backgroundColor: darkMode ? "#111827" : "#eff6ff",
          color: primary,
        }}
      >
        Total New Patients: {totalNewPatients}
      </div>
    </motion.div>
  );
};

export default NewPatientChart;
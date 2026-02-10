import React, { useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const generateRandomPatients = (daysInMonth) =>
  Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 10) + 1);

const NewPatientChart = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 10));
  const [selectedDay, setSelectedDay] = useState(10);
  const [startIndex, setStartIndex] = useState(7);
  const [chartData, setChartData] = useState(generateRandomPatients(31));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    weekday: new Date(year, month, i + 1).toLocaleDateString("en-US", { weekday: "short" }),
    date: i + 1,
  }));

  const VISIBLE_DAYS = 5;

  const selectDay = (day) => {
    setSelectedDay(day);
    const newData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 5) + 1);
    setChartData(newData);

    if (day >= startIndex + VISIBLE_DAYS) {
      setStartIndex(Math.min(day - VISIBLE_DAYS + 1, days.length - VISIBLE_DAYS));
    }
    if (day <= startIndex) {
      setStartIndex(Math.max(day - 1, 0));
    }
  };

  const changeMonth = (direction) => {
    const newDate = new Date(year, month + direction, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
    setStartIndex(0);
    setChartData(generateRandomPatients(getDaysInMonth(newDate.getFullYear(), newDate.getMonth())));
  };

  const lineData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: `New Patients on ${monthNames[month]} ${selectedDay}`,
        data: chartData,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
    },
    maintainAspectRatio: false,
  };

  const totalNewPatients = chartData.reduce((acc, val) => acc + val, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="font-bold text-sm text-gray-900">New Patients</h2>
        <div className="flex items-center gap-3 px-3 py-1 rounded-full">
          <button onClick={() => changeMonth(-1)} className="hover:text-blue-600 transition cursor-pointer">
            <FiChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="hover:text-blue-600 transition cursor-pointer">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Days navigation */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button onClick={() => selectDay(selectedDay - 1)} disabled={selectedDay <= 1}>
          <FiChevronLeft className="text-gray-400 disabled:opacity-20" />
        </button>
        <div className="flex flex-1 justify-between">
          {days.slice(startIndex, startIndex + VISIBLE_DAYS).map((d) => (
            <button
              key={`${month}-${d.date}`}
              onClick={() => selectDay(d.date)}
              className={`relative flex flex-col items-center min-w-[50px] py-2 rounded-xl transition-all duration-300
              ${selectedDay === d.date ? "text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <span className="text-[10px] uppercase tracking-wider font-bold">{d.weekday}</span>
              <span className="text-lg font-semibold">{d.date}</span>
              {selectedDay === d.date && (
                <motion.div
                  layoutId="activeDay"
                  className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </div>
        <button onClick={() => selectDay(selectedDay + 1)} disabled={selectedDay >= daysInMonth}>
          <FiChevronRight className="text-gray-400 disabled:opacity-20" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px] mb-4">
        <Line data={lineData} options={options} />
      </div>

      {/* Total New Patients */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 text-blue-600 font-bold text-center py-2 rounded-xl"
      >
        Total New Patients: {totalNewPatients}
      </motion.div>
    </motion.div>
  );
};

export default NewPatientChart;

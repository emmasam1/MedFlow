import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const Appointments = () => {
  const { fetchAppointments, appointments } = useAppStore();
  const { darkMode } = useStore();
  

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [startIndex, setStartIndex] = useState(
    Math.max(today.getDate() - 2, 0),
  );

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const selectDay = (day) => {
    if (day < 1 || day > daysInMonth) return;

    setSelectedDay(day);

    if (day >= startIndex + VISIBLE_DAYS) {
      setStartIndex(
        Math.min(day - VISIBLE_DAYS + 1, days.length - VISIBLE_DAYS),
      );
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
  };

  const todaysAppointments = appointments.filter((appt) => {
    if (!appt.date) return false;
    const apptDate = new Date(appt.date);

    return (
      apptDate.getFullYear() === year &&
      apptDate.getMonth() === month &&
      apptDate.getDate() === selectedDay
    );
  });

  /* 🎨 THEME VARIABLES */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";

  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-400";

  const hoverBg = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";

  const cardBg = darkMode
    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
    : "bg-white border-gray-100 hover:shadow-md hover:border-blue-100";

  const badgeBg = darkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-gray-50 text-gray-600";

  return (
    <div
      className={`${containerBg} rounded-xl shadow-lg p-4 border flex flex-col h-[400px] transition-colors duration-300`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className={`font-bold text-sm ${textPrimary}`}>Appointments</h2>

        <div className="flex items-center gap-3 px-3 py-1 rounded-full">
          <button
            onClick={() => changeMonth(-1)}
            className={`${hoverBg} ${darkMode ? "text-white" : "text-gray-700"} p-1 rounded-full transition-colors duration-300 cursor-pointer`}
          >
            <FiChevronLeft size={18} />
          </button>

          <span className={`text-sm font-medium ${textSecondary}`}>
            {monthNames[month]} {year}
          </span>

          <button
            onClick={() => changeMonth(1)}
            className={`${hoverBg} ${darkMode ? "text-white" : "text-gray-700"} p-1 rounded-full transition-colors duration-300 cursor-pointer`}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* DAYS NAVIGATION */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button
          onClick={() => selectDay(selectedDay - 1)}
          disabled={selectedDay <= 1}
        >
          <FiChevronLeft className="text-gray-400 disabled:opacity-20" />
        </button>

        <div className="flex flex-1 justify-between">
          {days.slice(startIndex, startIndex + VISIBLE_DAYS).map((d) => (
            <button
              key={`${month}-${d.date}`}
              onClick={() => selectDay(d.date)}
              className={`relative flex flex-col items-center min-w-[50px] py-2 rounded-xl transition-all duration-300
              ${
                selectedDay === d.date
                  ? "text-blue-500"
                  : `${textMuted} ${hoverBg}`
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-bold">
                {d.weekday}
              </span>
              <span className="text-lg font-semibold">{d.date}</span>

              {selectedDay === d.date && (
                <motion.div
                  layoutId="activeDay"
                  className={`absolute inset-0 rounded-xl -z-10 ${
                    darkMode
                      ? "bg-blue-900/30 border border-blue-700"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => selectDay(selectedDay + 1)}
          disabled={selectedDay >= daysInMonth}
        >
          <FiChevronRight className="text-gray-400 disabled:opacity-20" />
        </button>
      </div>

      {/* COUNT INFO */}
      <motion.p
        key={selectedDay}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm font-medium text-orange-500 mb-4 flex-shrink-0"
      >
        {todaysAppointments.length} appointment
        {todaysAppointments.length !== 1 && "s"} on {monthNames[month]}{" "}
        {selectedDay}
      </motion.p>

      {/* APPOINTMENT LIST */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {todaysAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <p className={`${textMuted} italic`}>No schedules for today</p>
            </motion.div>
          ) : (
            todaysAppointments.map((appt) => (
              <motion.div
                key={appt.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`group flex items-center justify-between border rounded-2xl p-4 transition-all ${cardBg}`}
              >
                <div className="flex gap-4">
                  <div className="w-[3px] rounded-full bg-blue-500" />

                  <div>
                    <p className={`font-bold capitalize ${textPrimary}`}>
                      {appt.patientName}
                    </p>

                    <p className="text-xs font-semibold text-blue-500 mb-1">
                      {appt.department}
                    </p>

                    <p
                      className={`text-[11px] flex items-center gap-1 ${textMuted}`}
                    >
                      🩺 {appt.assignedDoctor}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md ${badgeBg}`}
                  >
                    {appt.time}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Appointments;

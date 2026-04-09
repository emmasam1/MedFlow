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
  const { fetchAppointments, appointments, queue, getQueue } = useAppStore();
  const { darkMode } = useStore();

const user = useAppStore((state) => state.user);
  const role = user?.role?.toLowerCase().replace("_", " ");
  const isRecordOfficer = role === "record officer";

  const [activeTab, setActiveTab] = useState("appointments");

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [startIndex, setStartIndex] = useState(
    Math.max(today.getDate() - 2, 0),
  );

  // useEffect(() => {
  //   fetchAppointments();
  //   getQueue && getQueue();
  // }, []);

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

  /* ✅ FILTER USING createdAt */

  const isSameDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === selectedDay
    );
  };

  const todaysAppointments = appointments?.filter((a) =>
    isSameDate(a.date || a.createdAt),
  );

  const todaysQueue = queue?.filter((q) => isSameDate(q.createdAt));
  /* 🎨 THEME */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";

  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = "text-gray-400";

  const hoverBg = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";

  const cardBg = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100 hover:shadow-md";

  const badgeBg = darkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-gray-50 text-gray-600";

  return (
    <div
      className={`${containerBg} rounded-xl shadow-lg p-4 border flex flex-col  transition-colors`}
    >
      {/* 🔥 TABS */}
      {isRecordOfficer && (
        <div className="flex gap-2 mb-3 relative">
          {["appointments", "queue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-3 py-1 text-xs font-semibold capitalize"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  activeTab === tab ? "text-white" : textPrimary
                }`}
              >
                {tab}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-sm ${textPrimary}`}>
          {activeTab === "queue" ? "Queue" : "Appointments"}
        </h2>

        <div className="flex items-center gap-3 px-3 py-1 rounded-full">
          <button onClick={() => changeMonth(-1)}>
            <FiChevronLeft className="text-gray-400" />
          </button>

          <span className={`text-sm font-medium ${textSecondary}`}>
            {monthNames[month]} {year}
          </span>

          <button onClick={() => changeMonth(1)}>
            <FiChevronRight className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => selectDay(selectedDay - 1)}>
          <FiChevronLeft className="text-gray-400" />
        </button>

        <div className="flex flex-1 justify-between">
          {days.slice(startIndex, startIndex + VISIBLE_DAYS).map((d) => (
            <button
              key={d.date}
              onClick={() => selectDay(d.date)}
              className={`relative flex flex-col items-center min-w-[50px] py-2 rounded-xl ${
                selectedDay === d.date
                  ? "text-blue-500"
                  : `${textMuted} ${hoverBg}`
              }`}
            >
              <span className="text-[10px] uppercase font-bold">
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

        <button onClick={() => selectDay(selectedDay + 1)}>
          <FiChevronRight className="text-gray-400" />
        </button>
      </div>

      {/* COUNT */}
      <motion.p
        key={selectedDay + activeTab}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm font-medium text-orange-500 mb-3"
      >
        {activeTab === "queue"
          ? `${todaysQueue?.length} patient(s) in queue`
          : `${todaysAppointments?.length} appointment(s)`}
      </motion.p>

      {/* LIST */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden space-y-3 relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="absolute inset-0 w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "queue" ? (
              todaysQueue.length === 0 ? (
                <p className={`${textMuted}`}>No queue for this day</p>
              ) : (
                todaysQueue.map((q) => (
                  <div key={q.id} className={`p-3 border rounded-xl ${cardBg}`}>
                    <p className={`font-bold ${textPrimary}`}>
                      {q.patientName}
                    </p>
                    <p className="text-xs text-gray-400">{q.reason}</p>
                    <p className="text-xs text-orange-500">
                      Payment: {q.paymentStatus}
                    </p>
                  </div>
                ))
              )
            ) : todaysAppointments?.length === 0 ? (
              <p className={`${textMuted}`}>No appointments</p>
            ) : (
              todaysAppointments?.map((appt) => (
                <div
                  key={appt.id}
                  className={`p-3 border rounded-xl ${cardBg}`}
                >
                  <p className={`font-bold ${textPrimary}`}>
                    {appt.patientName}
                  </p>
                  <p className="text-xs text-blue-500">{appt.department}</p>
                  <p className="text-xs">{appt.time}</p>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Appointments;

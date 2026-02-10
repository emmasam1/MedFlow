import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ================== FIXED APPOINTMENTS DATA ================== */
// Note: Month 1 is February (0-indexed)
const appointmentsData = [
  {
    id: 1,
    year: 2026,
    month: 1,
    day: 10,
    name: "John Doe",
    type: "Consultation",
    doctor: "Dr. Verma",
    time: "09:00 AM",
    color: "bg-green-500",
  },
  {
    id: 2,
    year: 2026,
    month: 1,
    day: 10,
    name: "Bob Johnson",
    type: "Meeting",
    doctor: "Dr. Sharma",
    time: "10:00 AM",
    color: "bg-red-400",
  },
  {
    id: 3,
    year: 2026,
    month: 1,
    day: 10,
    name: "Sarah Wilson",
    type: "Follow-Up Visit",
    doctor: "Dr. Brown",
    time: "11:30 AM",
    color: "bg-yellow-400",
  },
  {
    id: 4,
    year: 2026,
    month: 1,
    day: 10,
    name: "David Miller",
    type: "Routine Checkup",
    doctor: "Dr. Verma",
    time: "01:00 PM",
    color: "bg-blue-400",
  },
  {
    id: 5,
    year: 2026,
    month: 1,
    day: 10,
    name: "Emily Clark",
    type: "Consultation",
    doctor: "Dr. Sharma",
    time: "03:00 PM",
    color: "bg-purple-400",
  },
  {
    id: 6,
    year: 2026,
    month: 1,
    day: 11,
    name: "Alice Smith",
    type: "Follow-Up Visit",
    doctor: "Dr. Brown",
    time: "09:30 AM",
    color: "bg-yellow-400",
  },
  {
    id: 7,
    year: 2026,
    month: 1,
    day: 11,
    name: "Mark Taylor",
    type: "Consultation",
    doctor: "Dr. Verma",
    time: "10:45 AM",
    color: "bg-green-500",
  },
  {
    id: 8,
    year: 2026,
    month: 1,
    day: 11,
    name: "Sophia Lee",
    type: "Routine Checkup",
    doctor: "Dr. Sharma",
    time: "12:00 PM",
    color: "bg-blue-400",
  },
  {
    id: 9,
    year: 2026,
    month: 1,
    day: 11,
    name: "James Brown",
    type: "Meeting",
    doctor: "Dr. Brown",
    time: "02:30 PM",
    color: "bg-red-400",
  },
  {
    id: 10,
    year: 2026,
    month: 1,
    day: 12,
    name: "Michael Lee",
    type: "Consultation",
    doctor: "Dr. Verma",
    time: "09:00 AM",
    color: "bg-green-500",
  },
  {
    id: 11,
    year: 2026,
    month: 1,
    day: 12,
    name: "Olivia Harris",
    type: "Follow-Up Visit",
    doctor: "Dr. Brown",
    time: "10:30 AM",
    color: "bg-yellow-400",
  },
  {
    id: 12,
    year: 2026,
    month: 1,
    day: 12,
    name: "Daniel Scott",
    type: "Routine Checkup",
    doctor: "Dr. Sharma",
    time: "12:15 PM",
    color: "bg-blue-400",
  },
  {
    id: 13,
    year: 2026,
    month: 1,
    day: 12,
    name: "Grace Adams",
    type: "Consultation",
    doctor: "Dr. Verma",
    time: "02:00 PM",
    color: "bg-purple-400",
  },
];

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
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 10));
  const [selectedDay, setSelectedDay] = useState(10);
  const [startIndex, setStartIndex] = useState(7); // Adjusted to show day 10 in the middle

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

  /* ================== FILTERING FIX ================== */
  const todaysAppointments = appointmentsData.filter(
    (appt) =>
      appt.year === year && appt.month === month && appt.day === selectedDay,
  );

 return (
  <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 flex flex-col h-[400px]">
    {/* HEADER */}
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <h2 className="font-bold text-sm text-gray-900">Appointments</h2>
      <div className="flex items-center gap-3 px-3 py-1 rounded-full">
        <button
          onClick={() => changeMonth(-1)}
          className="hover:text-blue-600 transition cursor-pointer"
        >
          <FiChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-gray-700 text-center">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="hover:text-blue-600 transition cursor-pointer"
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
              ${selectedDay === d.date ? "text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {d.weekday}
            </span>
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
      {todaysAppointments.length !== 1 && "s"} on {monthNames[month]} {selectedDay}
    </motion.p>

    {/* APPOINTMENT LIST - SCROLLABLE */}
    <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <AnimatePresence mode="popLayout">
        {todaysAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            <p className="text-gray-400 italic">No schedules for today</p>
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
              className="group flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-blue-100 transition-all bg-white"
            >
              <div className="flex gap-4">
                <div className={`w-[3px] rounded-full ${appt.color}`} />
                <div>
                  <p className="font-bold text-gray-800">{appt.name}</p>
                  <p className="text-xs font-semibold text-blue-500 mb-1">{appt.type}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <span className="grayscale group-hover:grayscale-0 transition">🩺</span>{" "}
                    {appt.doctor}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{appt.time}</span>
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

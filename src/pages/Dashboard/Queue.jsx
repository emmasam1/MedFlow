import React, { useState, useMemo, useRef, useEffect } from "react";
import { Calendar, ConfigProvider, theme } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiChevronDown } from "react-icons/hi";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer } from "react-toastify";
import CreateQueue from "../../components/CreateQueue";

const PER_PAGE = 10;

const statusStyles = (darkMode) => ({
  waiting: darkMode ? "bg-amber-700 text-white" : "bg-amber-100 text-amber-700",

  "ready-for-doctor": darkMode
    ? "bg-indigo-700 text-white"
    : "bg-indigo-100 text-indigo-700",

  "in-progress": darkMode
    ? "bg-blue-700 text-white"
    : "bg-blue-100 text-blue-700",

  done: darkMode
    ? "bg-emerald-700 text-white"
    : "bg-emerald-100 text-emerald-700",

  cancelled: darkMode ? "bg-red-700 text-white" : "bg-red-100 text-red-700",

  "awaiting-payment": darkMode
    ? "bg-purple-700 text-white"
    : "bg-purple-100 text-purple-700",
});

const Queue = () => {
  const { queue, getQueue, updateQueueStatus, cancelQueue } = useAppStore();
  const { darkMode } = useStore();

  const today = dayjs();

  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [leftWidth, setLeftWidth] = useState(380);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const isDragging = useRef(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    getQueue();
  }, []);

  /* RESIZER */

  const handleMouseDown = () => {
    if (window.innerWidth >= 1024) isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setLeftWidth(Math.min(Math.max(e.clientX, 300), 500));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDateSelect = (value) => {
    setSelectedDate(value.format("YYYY-MM-DD"));
    setCurrentPage(1);
  };

  /* FILTER QUEUE */

  const filtered = useMemo(() => {
    return queue
      .filter((q) => dayjs(q.timeAdded).format("YYYY-MM-DD") === selectedDate)
      .filter((q) =>
        q.patientName?.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((q) =>
        statusFilter === "All"
          ? true
          : q.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
  }, [queue, selectedDate, search, statusFilter]);

  const paginatedData = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const totalForDay = filtered.length;
  const waiting = filtered.filter((q) => q.status === "waiting").length;
  const progress = filtered.filter((q) => q.status === "in-progress").length;
  const done = filtered.filter((q) => q.status === "done").length;
  const cancelled = filtered.filter((q) => q.status === "cancelled").length;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } rounded-2xl shadow-sm overflow-hidden`}
    >
      <ToastContainer />

      {/* HEADER */}

      <div className="flex justify-between items-center p-3">
        <span className="font-semibold text-sm sm:text-base">Queue</span>

        {user?.role !== "doctor" && (
          <motion.button
            onClick={() => setIsQueueOpen(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-2 py-1 rounded-full text-[#005CBB] font-semibold flex items-center gap-1 hover:bg-[#9DCEF8] text-xs"
          >
            <PlusCircleIcon className="w-5 h-5" /> Queue
          </motion.button>
        )}
      </div>

      {/* MAIN */}

      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)]">
        {/* CALENDAR PANEL */}

        <div
          style={{ width: window.innerWidth < 1024 ? "100%" : leftWidth }}
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-4 overflow-y-auto`}
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: {
                colorPrimary: "#3b82f6", // main blue for selected day
                colorBgContainer: darkMode ? "#1f2937" : "#ffffff", // calendar background
                colorText: darkMode ? "#f9fafb" : "#111827", // normal text
                colorTextPlaceholder: darkMode ? "#d1d5db" : "#6b7280", // placeholder text
                colorFillAlter: darkMode ? "#374151" : "#f9fafb", // dropdown background
                colorTextLightSolid: darkMode ? "#f9fafb" : "#111827", // dropdown text
              },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              dateFullCellRender={(value) => {
                const formattedDate = value.format("YYYY-MM-DD");

                const queueForDay = queue.filter(
                  (q) =>
                    dayjs(q.timeAdded).format("YYYY-MM-DD") === formattedDate,
                );

                const isSelected = formattedDate === selectedDate;

                return (
                  <div
                    className={`h-full flex flex-col items-center justify-center rounded-lg ${
                      isSelected
                        ? darkMode
                          ? "bg-blue-800 text-white"
                          : "bg-blue-600 text-white"
                        : queueForDay.length > 0
                          ? darkMode
                            ? "bg-blue-900/30"
                            : "bg-blue-50 text-blue-700"
                          : ""
                    }`}
                  >
                    <span>{value.date()}</span>

                    {queueForDay.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {queueForDay.slice(0, 3).map((q) => (
                          <span
                            key={q.id}
                            className={`w-2 h-2 rounded-full ${
                              statusStyles(darkMode)[q.status]?.split(" ")[0]
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </ConfigProvider>

          {/* SUMMARY */}

          <div
            className={`mt-6 p-4 rounded-xl ${
              darkMode ? "bg-gray-700" : "bg-slate-50"
            }`}
          >
            <p className="text-sm">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>

            <p className="text-2xl font-semibold mt-1">{totalForDay} Queue</p>

            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <span className="text-amber-500">{waiting} Waiting</span>
              <span className="text-blue-500">{progress} In Progress</span>
              <span className="text-emerald-500">{done} Done</span>
              <span className="text-red-500">{cancelled} Cancelled</span>
            </div>
          </div>
        </div>

        {/* RESIZER */}

        <div
          onMouseDown={handleMouseDown}
          className="hidden lg:block w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize"
        />

        {/* RIGHT PANEL */}

        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          {/* FILTERS */}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* SEARCH */}

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-slate-200 bg-white text-gray-900"
                } text-sm focus:outline-none`}
              />
              <HiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* STATUS FILTER */}

            <div className="relative w-full sm:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`appearance-none w-full py-2.5 px-4 pr-10 rounded-xl border text-sm ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-slate-200 bg-white text-gray-900"
                }`}
              >
                <option value="All">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <HiChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* QUEUE LIST */}

          <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
              {paginatedData.map((q) => {
                // compute displayStatus per item
                const displayStatus =
                  q.paymentStatus !== "paid" && q.status === "waiting"
                    ? "awaiting-payment"
                    : q.status;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`${
                      darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-slate-50 text-gray-900"
                    } p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between gap-3`}
                  >
                    <div className="flex justify-end">
                      {/* STATUS */}
                      <span
                        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                          statusStyles(darkMode)[displayStatus]
                        }`}
                      >
                        {displayStatus === "awaiting-payment"
                          ? "Awaiting Payment"
                          : displayStatus === "in-progress"
                            ? "In Progress"
                            : displayStatus}
                      </span>
                    </div>

                    {/* PATIENT INFO */}
                    <div className="flex-1 mb-2">
                      <p className="font-medium">{q.patientName}</p>
                      <p className="text-sm text-slate-400">{q.reason}</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* DOCTOR ACTIONS */}
                      {user?.role === "doctor" &&
                        q.status !== "done" &&
                        q.paymentStatus === "paid" && (
                          <>
                            {q.status !== "in-progress" && (
                              <button
                                onClick={() =>
                                  updateQueueStatus(q.id, "in-progress")
                                }
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg cursor-pointer"
                              >
                                Start
                              </button>
                            )}
                            <button
                              onClick={() => updateQueueStatus(q.id, "done")}
                              className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer"
                            >
                              Done
                            </button>
                          </>
                        )}

                      {/* RECORD OFFICER ACTIONS */}
                      {user?.role === "record_officer" &&
                        q.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to cancel this queue?",
                                )
                              ) {
                                cancelQueue(q.id);
                              }
                            }}
                            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {paginatedData.length === 0 && (
              <p className="text-sm text-slate-400">No queue for this day.</p>
            )}
          </div>

          {/* MODAL */}

          <Modal
            isOpen={isQueueOpen}
            onClose={() => setIsQueueOpen(false)}
            title="Patient Queue"
            size="3xl"
          >
            <CreateQueue onSuccess={() => setIsQueueOpen(false)} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Queue;

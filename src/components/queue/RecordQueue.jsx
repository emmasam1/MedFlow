import React, { useState, useMemo, useEffect } from "react";
import { Skeleton, Calendar, ConfigProvider, theme } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiCalendar, HiOutlineClipboardList } from "react-icons/hi";
import { ToastContainer, Bounce } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { HiUserAdd } from "react-icons/hi";
import Modal from "../../components/Modal";
import CreateQueue from "../../components/CreateQueue";

// Polished Empty State Component
const EmptyQueueState = ({ date, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? "bg-gray-800" : "bg-blue-900/30"}`}
    >
      <HiOutlineClipboardList
        size={48}
        className={darkMode ? "text-gray-600" : "text-blue-400"}
      />
    </div>
    <h3
      className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
    >
      All Caught Up!
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
      There are no patient records found for{" "}
      <span className="font-semibold text-blue-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      . Enjoy the breather!
    </p>
  </motion.div>
);

const RecordQueue = () => {
  const { queue = [], getQueue, user } = useAppStore();
  const { darkMode } = useStore();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [localLoading, setLocalLoading] = useState(true);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  console.log(queue);

  const getPatientName = (q) =>
    q?.patientName || q?.patient?.name || "Unknown Patient";

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      await getQueue(user?.role, selectedDate);
      setLocalLoading(false);
    };
    fetchData();
  }, [selectedDate, user?.role, getQueue]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(queue)) return [];
    return queue.filter((q) => {
      const matchesDate =
        dayjs(q.timeAdded || q.createdAt).format("YYYY-MM-DD") === selectedDate;
      const matchesSearch = getPatientName(q)
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        q.status?.toLowerCase() === statusFilter.toLowerCase();
      let matchesRole =
        user?.role === "nurse"
          ? q.currentStage === "TRIAGE" || !q.currentStage
          : true;
      return matchesDate && matchesSearch && matchesStatus && matchesRole;
    });
  }, [queue, selectedDate, search, statusFilter, user?.role]);

  const stats = {
    total: filteredData.length,
    triage: filteredData.filter((q) => q.currentStage === "TRIAGE").length,
    progress: filteredData.filter((q) => q.status === "in-progress").length,
    done: filteredData.filter((q) => q.status === "done").length,
  };

  /* ---------------- Animations & Styles ---------------- */
  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}
    >
      <ToastContainer transition={Bounce} />

      {/* HEADER */}
      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Patient Queue</h2>
          <p className="text-xs text-gray-500">Manage and track patient flow</p>
        </div>

        {/* UPDATED: Dark Mode Compatible Date Selector */}
        <div className="flex items-center gap-5">
          <motion.button
            {...buttonMotion}
            onClick={() => setIsQueueOpen(true)}
            className={`${buttonStyle} flex items-center gap-2`}
          >
            <HiUserAdd size={20} className="mb-0.5" />
            <span>Check-in Patient</span>
          </motion.button>

          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
            }}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <HiCalendar className="text-blue-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`bg-transparent text-sm outline-none cursor-pointer ${
                  darkMode ? "[color-scheme:dark]" : ""
                }`}
              />
            </div>
          </ConfigProvider>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Calendar Section */}
        <div
          className={`w-[400px] border-r ${darkMode ? "border-gray-800" : "border-gray-100"} p-5 hidden lg:block overflow-y-auto`}
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: { colorPrimary: "#3b82f6" },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={(val) => setSelectedDate(val.format("YYYY-MM-DD"))}
            />
          </ConfigProvider>

          <div
            className={`mt-6 p-6 rounded-xl border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-slate-50 border-transparent"
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-3xl font-bold">{stats.total} Queue</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Triage</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    darkMode
                      ? "bg-amber-900/40 text-amber-500"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {stats.triage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">In Progress</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    darkMode
                      ? "bg-blue-900/40 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {stats.progress}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Completed</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    darkMode
                      ? "bg-emerald-900/40 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {stats.done}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LIST AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 placeholder-gray-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {localLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}
                >
                  <Skeleton active avatar />
                </div>
              ))
            ) : filteredData.length === 0 ? (
              <EmptyQueueState date={selectedDate} darkMode={darkMode} />
            ) : (
              <AnimatePresence>
                {filteredData.map((q) => (
                  <motion.div
                    key={q.id || q._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-5 rounded-2xl border flex justify-between items-center transition-all hover:shadow-md ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          darkMode
                            ? "bg-blue-900/40 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {getPatientName(q).charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base">
                          {getPatientName(q)}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          {q.reasonForVisit || "Consultation"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                        darkMode
                          ? "bg-blue-900/40 text-blue-400 border border-blue-800"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {q.currentStage || "RECEPTION"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        title="New Queue Entry"
      >
        <CreateQueue onSuccess={() => setIsQueueOpen(false)} />
      </Modal>
    </div>
  );
};

export default RecordQueue;

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Skeleton, Calendar, ConfigProvider, theme } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiChevronDown, HiCalendar } from "react-icons/hi";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import DoctorsAppointment from "../../components/DoctorsAppointment";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer } from "react-toastify";
import { HiUserAdd } from "react-icons/hi";

const PER_PAGE = 10;

// ✅ Status styles as a function to handle dark mode
const statusStyles = (darkMode) => ({
  Confirmed: darkMode
    ? "bg-emerald-700 text-white"
    : "bg-emerald-100 text-emerald-700",
  Pending: darkMode ? "bg-amber-700 text-white" : "bg-amber-100 text-amber-700",
  Completed: darkMode ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-700",
  Cancelled: darkMode ? "bg-red-700 text-white" : "bg-red-100 text-red-700",
});

const RecordAppointment = () => {
  const {
    appointments = [],
    fetchAppointments,
    updateApptStatus,
  } = useAppStore();

  const { darkMode } = useStore();
  const today = dayjs();

  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [leftWidth, setLeftWidth] = useState(380);
  const [isOpen, setIsOpen] = useState(false);

  const isDragging = useRef(false);
  const user = useAppStore((state) => state.user);

  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openConfirmModal = (appt) => {
    setSelectedAppt(appt);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    updateStatus(selectedAppt.id, "Confirmed");
    setShowConfirmModal(false);
  };

  useEffect(() => {
    // fetchAppointments();
  }, []);

  // Resizer handlers
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

  const updateStatus = async (id, newStatus) => {
    await updateApptStatus(id, newStatus);
  };

  const filtered = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((a) => a.date === selectedDate)
      .filter((a) =>
        (a.patient || a.patientName || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      .filter((a) =>
        statusFilter === "All"
          ? true
          : a.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
  }, [appointments, selectedDate, search, statusFilter]);

  const paginatedData = filtered?.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const hasAppointmentOnDay = (date) =>
    appointments.some((a) => a.date === date.format("YYYY-MM-DD"));

  const totalForDay = filtered.length;
  const confirmed = filtered.filter(
    (a) => a.status?.toLowerCase() === "confirmed",
  ).length;
  const pending = filtered.filter(
    (a) => a.status?.toLowerCase() === "pending",
  ).length;
  const cancelled = filtered.filter(
    (a) => a.status?.toLowerCase() === "cancelled",
  ).length;

  const filteredData = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    return appointments.filter((q) => {
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
  }, [appointments, selectedDate, search, statusFilter, user?.role]);

  const stats = {
    total: filteredData.length,
    triage: filteredData.filter((q) => q.currentStage === "TRIAGE").length,
    progress: filteredData.filter((q) => q.status === "in-progress").length,
    done: filteredData.filter((q) => q.status === "done").length,
  };

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
      <ToastContainer />

      {/* HEADER */}
      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Patient Appointments</h2>
          <p className="text-xs text-gray-500">Manage and track patient flow</p>
        </div>

        {/* UPDATED: Dark Mode Compatible Date Selector */}
        <div className="flex items-center gap-5">
          <motion.button
            {...buttonMotion}
            onClick={() => setIsOpen(true)}
            className={`${buttonStyle} flex items-center gap-2`}
          >
            <HiUserAdd size={20} className="mb-0.5" />
            <span>Appointment</span>
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

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
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
              onSelect={handleDateSelect}
              dateFullCellRender={(value) => {
                const formattedDate = value.format("YYYY-MM-DD");
                const apptsForDay = appointments.filter(
                  (a) => a.date === formattedDate,
                );
                const isSelected = formattedDate === selectedDate;
                const hasAppt = apptsForDay.length > 0;

                return (
                  <div
                    className={`h-full flex flex-col items-center justify-center rounded-lg transition
        ${
          isSelected
            ? darkMode
              ? "bg-blue-800 text-white"
              : "bg-blue-600 text-white"
            : hasAppt
              ? darkMode
                ? "bg-blue-900/30 text-white"
                : "bg-blue-50 text-blue-700"
              : ""
        }
      `}
                  >
                    <span>{value.date()}</span>

                    {apptsForDay.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {apptsForDay.slice(0, 3).map((appt) => (
                          <span
                            key={appt.id}
                            className={` rounded-full ${statusStyles(darkMode)[appt.status]}`}
                            title={appt.status}
                          />
                        ))}
                        {/* {apptsForDay.length > 3 && (
                          <span className="text-[8px] text-gray-400 dark:text-gray-300">
                            +{apptsForDay.length - 3}
                          </span>
                        )} */}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </ConfigProvider>

          {/* SUMMARY */}

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
            <p className="text-3xl font-bold">
              {totalForDay}
              Appointments
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  {/* {confirmed}  */}
                  Confirmed
                </span>
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
                <span className="text-gray-500 text-sm">
                  {/* {confirmed}  */}
                  Pending
                </span>
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
                <span className="text-gray-500 text-sm">
                  {/* {confirmed}  */}
                  Cancelled
                </span>
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
            </div>
          </div>
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize"
        />

        {/* RIGHT PANEL */}
        <div className="flex-1 p-6 flex flex-col">
          {/* FILTERS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* SEARCH */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                      : "border-slate-200 bg-white text-gray-900"
                  } text-sm focus:outline-none focus:ring-2`}
                />
                <HiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* STATUS SELECT */}
              <div className="relative w-full sm:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`appearance-none w-full py-2.5 px-4 pr-10 rounded-xl border text-sm cursor-pointer ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-slate-200 bg-white text-gray-900"
                  }`}
                >
                  <option value="All">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <HiChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* APPOINTMENTS LIST */}
          <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
              {paginatedData.map((appt) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-slate-50 text-gray-900"
                  } p-4 rounded-xl flex justify-between items-center`}
                >
                  <div>
                    <p className="font-medium capitalize">{appt.patientName}</p>
                    <p className="text-sm text-slate-400">
                      {appt.assignedDoctor} •{" "}
                      {dayjs(`2026-02-26 ${appt.time}`).format("h:mm A")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        statusStyles(darkMode)[appt.status]
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {paginatedData.length === 0 && (
              <p className="text-sm text-slate-400">
                No appointments for this day.
              </p>
            )}

            {showConfirmModal && (
              <Modal
                title="Confirm Appointment"
                onClose={() => setShowConfirmModal(false)}
              >
                <p className="text-sm text-gray-600">
                  Are you sure you want to confirm this appointment?
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white"
                  >
                    Yes, Confirm
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Appointment"
        size="2xl"
      >
        <DoctorsAppointment onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};

export default RecordAppointment;

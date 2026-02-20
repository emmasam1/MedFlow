import React, { useState, useMemo, useRef, useEffect } from "react";
import { Calendar } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiChevronDown } from "react-icons/hi";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import SearchPatientTab from "../../components/SearchPatientTab";
import ScanPatientTab from "../../components/ScanPatientTab";
import CreateAppointmentStep from "../../components/CreateAppointmentStep";
import DoctorsAppointment from "../../components/DoctorsAppointment";

const PER_PAGE = 10;

const generateAppointments = () => {
  const statuses = ["Confirmed", "Pending", "Completed", "Cancelled"];
  const doctors = ["Dr. Ella", "Dr. Ahmed", "Dr. Smith"];
  const data = [];

  for (let i = 1; i <= 60; i++) {
    const randomDay = 8 + (i % 5);
    data.push({
      id: i,
      patient: `Patient ${i}`,
      doctor: doctors[i % 3],
      time: `${8 + (i % 8)}:00`,
      status: statuses[i % 4],
      date: `2026-02-${randomDay}`,
    });
  }

  return data;
};

const statusStyles = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Appointment = () => {
  const [appointments, setAppointments] = useState(generateAppointments());
  const [selectedDate, setSelectedDate] = useState("2026-02-10");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [leftWidth, setLeftWidth] = useState(380);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [step, setStep] = useState("search");

  const isDragging = useRef(false);

  const handleMouseDown = () => {
    if (window.innerWidth < 1024) return;
    isDragging.current = true;
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

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  };

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => a.date === selectedDate)
      .filter((a) => a.patient.toLowerCase().includes(search.toLowerCase()))
      .filter((a) =>
        statusFilter === "All" ? true : a.status === statusFilter,
      );
  }, [appointments, selectedDate, search, statusFilter]);

  // const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginatedData = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const hasAppointmentOnDay = (date) => {
    const formatted = date.format("YYYY-MM-DD");
    return appointments.some((a) => a.date === formatted);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setStep("search"); // reset workflow
    setSelectedPatient(null); // clear patient
    setActiveTab("search"); // reset tab
  };

  const totalForDay = filtered.length;
  const confirmed = filtered.filter((a) => a.status === "Confirmed").length;
  const pending = filtered.filter((a) => a.status === "Pending").length;
  const cancelled = filtered.filter((a) => a.status === "Cancelled").length;

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold text-gray-800">Appointment</span>
        <motion.button
          onClick={handleOpenModal}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
          className=" px-2 py-1 rounded-full text-[#005CBB] font-semibold flex items-center justify-end gap-1
            hover:bg-[#9DCEF8] transition-colors duration-300 text-xs cursor-pointer"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Appointment
        </motion.button>

        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          title="Create Appointment"
          size="2xl"
        >
          <DoctorsAppointment />
        </Modal>
      </div>

      <div className="hidden lg:flex h-[calc(100vh-140px)]">
        {/* LEFT PANEL */}
        <div
          style={{ width: leftWidth }}
          className="bg-white p-4 overflow-y-auto"
        >
          <Calendar
            fullscreen={false}
            onSelect={handleDateSelect}
            dateFullCellRender={(value) => {
              const isSelected = value.format("YYYY-MM-DD") === selectedDate;

              const hasAppt = hasAppointmentOnDay(value);

              return (
                <div
                  className={`h-full flex items-center justify-center rounded-lg transition 
                  ${isSelected ? "bg-blue-600 text-white" : ""}
                  ${!isSelected && hasAppt ? "bg-blue-50 text-blue-600 font-medium" : ""}
                  `}
                >
                  {value.date()}
                </div>
              );
            }}
          />

          {/* SUMMARY UNDER CALENDAR */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-500">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">
              {totalForDay} Appointments
            </p>

            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-emerald-600">{confirmed} Confirmed</span>
              <span className="text-amber-600">{pending} Pending</span>
              <span className="text-red-600">{cancelled} Cancelled</span>
            </div>
          </div>
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize"
        />

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white p-6 flex flex-col">
          {/* FILTERS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* LEFT SIDE - FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                  transition text-sm"
                />

                {/* LEFT SEARCH ICON */}
                <HiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                {/* RIGHT CLICK BUTTON */}
                <button
                  onClick={() => console.log("Searching:", search)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 
                  p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <HiSearch size={14} />
                </button>
              </div>

              {/* STATUS SELECT */}
              <div className="relative w-full sm:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full py-2.5 px-4 pr-10 rounded-xl 
                  border border-slate-200 bg-white text-sm
                  outline-none transition cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Custom Arrow */}
                <HiChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
              {paginatedData.map((appt) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-50 p-4 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{appt.patient}</p>
                    <p className="text-sm text-slate-500">
                      {appt.doctor} • {appt.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[appt.status]}`}
                    >
                      {appt.status}
                    </span>

                    {appt.status === "Pending" && (
                      <button
                        onClick={() => updateStatus(appt.id, "Confirmed")}
                        className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                      >
                        Confirm
                      </button>
                    )}

                    {appt.status !== "Cancelled" &&
                      appt.status !== "Completed" && (
                        <button
                          onClick={() => updateStatus(appt.id, "Cancelled")}
                          className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {paginatedData.length === 0 && (
              <p className="text-sm text-slate-400">
                No appointments for this day.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;

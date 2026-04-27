import React, { useState, useMemo, useEffect } from "react";
import { Skeleton, Calendar, ConfigProvider, theme } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiCalendar, HiOutlineClipboardList } from "react-icons/hi";
import { ToastContainer, Bounce } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import VitalsModal from "../../components/VitalsModal";
import Modal from "../../components/Modal";

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
      No patient records found for{" "}
      <span className="font-semibold text-blue-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      .
    </p>
  </motion.div>
);

const NurseQueue = () => {
  const { queue = [], getQueue, user, takeVitals } = useAppStore();
  const { darkMode } = useStore();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);

  const openVitalsModal = (q) => {
    setSelectedQueue(q);
    setVitalsModalOpen(true);
  };

//   console.log("Current queue data in NurseQueue:", queue);

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
        dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate;
      const patient = q.patientId || {};
      const fullName =
        `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        q.queueId?.toLowerCase().includes(search.toLowerCase());

      // Filter for Triage stage if user is a nurse
      const matchesRole =
        user?.role === "nurse" ? q.currentStage === "TRIAGE" : true;

      return (
        matchesDate && matchesSearch && matchesRole && q.status === "active"
      );
    });
  }, [queue, selectedDate, search, user?.role]);

  const stats = {
    total: filteredData.length,
    triage: filteredData.filter((q) => q.currentStage === "TRIAGE").length,
    urgent: filteredData.filter((q) => q.isUrgent).length,
  };

  // Calendar render logic for clean UI
  const fullCellRender = (date, info) => {
    if (info.type !== "date") return info.originNode;

    const dateStr = date.format("YYYY-MM-DD");
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === dayjs().format("YYYY-MM-DD");

    const hasPending = queue.some(
      (q) =>
        dayjs(q.createdAt).format("YYYY-MM-DD") === dateStr &&
        q.currentStage === "TRIAGE" &&
        q.status === "active",
    );

    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected ? "!bg-blue-600 !text-white shadow-md" : ""}
            ${!isSelected && hasPending ? "bg-amber-50 text-amber-600 border border-amber-200 font-bold" : ""}
            ${!isSelected && isToday ? "border border-blue-500 text-blue-500 font-medium" : ""}
            ${!isSelected && !isToday && !hasPending ? (darkMode ? "text-gray-400" : "text-gray-700") : ""}
          `}
        >
          {date.date()}
          {hasPending && (isSelected || isToday) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}
    >
      <ToastContainer transition={Bounce} />

      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Patient Queue</h2>
          <p className="text-xs text-gray-500">Manage and track triage flow</p>
        </div>

        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"}`}
          >
            <HiCalendar className="text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`bg-transparent text-sm outline-none cursor-pointer ${darkMode ? "[color-scheme:dark]" : ""}`}
            />
          </div>
        </ConfigProvider>
      </div>

      <div className="flex flex-1 overflow-hidden">
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
              fullCellRender={fullCellRender}
            />
          </ConfigProvider>

          <div
            className={`mt-6 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-slate-50 border-transparent"}`}
          >
            <p className="text-sm text-gray-500 mb-1">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-3xl font-bold">{stats.total} Queue</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Triage Needed</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? "bg-amber-900/40 text-amber-500" : "bg-amber-100 text-amber-600"}`}
                >
                  {stats.triage}
                </span>
              </div>
              {stats.urgent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Urgent Cases</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-600">
                    {stats.urgent}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or Queue ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-gray-800 border-gray-700 placeholder-gray-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {localLoading ? (
              <div className="p-6">
                <Skeleton active avatar />
              </div>
            ) : filteredData.length === 0 ? (
              <EmptyQueueState date={selectedDate} darkMode={darkMode} />
            ) : (
              <AnimatePresence>
                {filteredData.map((q) => (
                  <motion.div
                    key={q._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border flex justify-between items-center transition-all hover:shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                      >
                        {q.patientId?.firstName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base capitalize">
                            {q.patientId?.firstName} {q.patientId?.lastName}
                          </h4>
                          {q.isUrgent && (
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {q.reasonForVisit || "Consultation"} •{" "}
                          <span className="font-mono text-[10px]">
                            {q.queueId}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${darkMode ? "bg-amber-900/40 text-amber-500 border border-amber-800" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                      {q.currentStage}
                    </span> */}
                    <button
                      onClick={() => openVitalsModal(q)}
                      className="text-xs font-bold px-4 py-2 cursor-pointer bg-green-600 text-white hover:bg-green-700"
                    >
                      Process Vitals
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={vitalsModalOpen}
        onClose={() => setVitalsModalOpen(false)}
        title={
          <span className="capitalize">
            Patient Assessment: {selectedQueue?.patientId?.firstName || ""}
            &nbsp;
            {selectedQueue?.patientId?.lastName || ""}
          </span>
        }
      >
        <VitalsModal
          queueItem={selectedQueue}
          takeVitals={takeVitals}
          onClose={() => setVitalsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NurseQueue;

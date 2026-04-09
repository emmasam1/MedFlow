import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ConfigProvider, theme } from "antd";
import DoctorsAppointment from "./DoctorsAppointment";
import CreateQueue from "./CreateQueue";
import Modal from "./Modal";
import { useStore } from "../store/store";
import { useAppStore } from "../store/useAppStore";

const BookAppointment = ({ queue = [] }) => {
  const { darkMode } = useStore();
  const user = useAppStore((state) => state.user);
  const role = user?.role?.toLowerCase().replace("_", " ");
  const isRecordOfficer = role === "record officer";

  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateSelect = (date) => {
    const jsDate = date.toDate ? date.toDate() : date;
    setSelectedDate(jsDate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  /* THEME */
  const containerBg = darkMode
    ? "bg-[#1a202c] border-gray-700"
    : "bg-white border-gray-100";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = "text-gray-400";

  return (
    <div className={`rounded-xl shadow-md p-4 transition-colors duration-300 ${containerBg}`}>
      
      {/* 🔥 TABS */}
      {isRecordOfficer && (
        <div className="flex gap-2 mb-4 relative">
          {["appointments", "queue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-3 py-1 text-xs font-semibold capitalize"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId={`activeTab-${tab}`} // unique layoutId for each tab
                  className="absolute inset-0 bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === tab ? "text-white" : textPrimary}`}>
                {tab}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* HEADER */}
      <h2 className={`text-sm font-bold mb-2 ${textPrimary}`}>
        {activeTab === "appointments" ? "Appointment Calendar" : "Queue Calendar"}
      </h2>
      <p className={`text-xs mb-2 italic ${textMuted}`}>
        {activeTab === "appointments"
          ? "Click on a day to book an appointment"
          : "Click on a day to add a patient to the queue"}
      </p>

      {/* CALENDAR + LIST */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab} // ensures motion re-mounts for tab switch
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: { colorPrimary: "#3B82F6", borderRadius: 8 },
              components: {
                Calendar: {
                  colorBgContainer: darkMode ? "#1f2937" : "#ffffff",
                  colorText: darkMode ? "#ffffff" : "#1f2937",
                  colorBorder: darkMode ? "#374151" : "#e5e7eb",
                },
              },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              className="rounded-lg"
            />
          </ConfigProvider>

          {/* QUEUE LIST */}
          {activeTab === "queue" && selectedDate && (
            <div className="mt-3 flex flex-col gap-2 max-h-[250px] overflow-y-auto">
              {queue.filter(q => {
                const d = new Date(q.createdAt);
                return (
                  d.getFullYear() === selectedDate.getFullYear() &&
                  d.getMonth() === selectedDate.getMonth() &&
                  d.getDate() === selectedDate.getDate()
                );
              }).length === 0 ? (
                <p className={textMuted}>No queue for this day</p>
              ) : (
                queue
                  .filter(q => {
                    const d = new Date(q.createdAt);
                    return (
                      d.getFullYear() === selectedDate.getFullYear() &&
                      d.getMonth() === selectedDate.getMonth() &&
                      d.getDate() === selectedDate.getDate()
                    );
                  })
                  .map(q => (
                    <div
                      key={q.id}
                      className={`p-3 border rounded-xl ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                    >
                      <p className={`font-bold ${textPrimary}`}>{q.patientName}</p>
                      <p className="text-xs text-gray-400">{q.reason}</p>
                      <p className="text-xs text-orange-500">Payment: {q.paymentStatus}</p>
                    </div>
                  ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={activeTab === "appointments" ? "Create Appointment" : "Add Patient to Queue"}
          size="2xl"
        >
          {activeTab === "appointments" ? (
            <DoctorsAppointment
              selectedDate={selectedDate}
              onSuccess={handleCloseModal}
            />
          ) : (
            <CreateQueue
              selectedDate={selectedDate}
              onSuccess={handleCloseModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default BookAppointment;
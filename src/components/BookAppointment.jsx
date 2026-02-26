import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ConfigProvider, theme } from "antd";
import DoctorsAppointment from "./DoctorsAppointment";
import Modal from "./Modal";
import { useStore } from "../store/store";

const BookAppointment = () => {
  const { darkMode } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`rounded-xl shadow-md p-4 transition-colors duration-300 ${
          darkMode
            ? "bg-[#1a202c] border border-gray-700"
            : "bg-white border border-gray-100"
        }`}
      >
        <h2
          className={`text-sm font-bold mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Appointment Calendar
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs mb-2 italic ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Click on a day to book an appointment
        </motion.div>

        {/* 🔥 FORCE ANTD THEME */}
        <ConfigProvider
          theme={{
            algorithm: darkMode
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#3B82F6", // your blue
              borderRadius: 8,
            },
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
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Appointment"
        size="2xl"
      >
        <DoctorsAppointment selectedDate={selectedDate} />
      </Modal>
    </div>
  );
};

export default BookAppointment;
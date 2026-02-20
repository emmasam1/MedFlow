import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "antd";
import DoctorsAppointment from "./DoctorsAppointment";
import Modal from "./Modal";

const BookAppointment = () => {
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
        className="bg-white rounded-xl shadow-md p-4"
      >
        <h2 className="text-sm font-bold mb-1 text-gray-800">
          Appointment Calendar
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 mb-2 italic"
        >
          Click on a day to book an appointment
        </motion.div>

        <Calendar
          fullscreen={false}
          onSelect={handleDateSelect}
          className="rounded-lg"
        />
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
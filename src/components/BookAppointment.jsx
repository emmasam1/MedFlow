import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Modal, Form, Input, Select, TimePicker, Button } from "antd";

const BookAppointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setShowHint(false); // hide hint once user clicks a day
  };

  const handleClose = () => {
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

        {/* Hint for the user */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-500 mb-2 italic"
          >
            Click on a day to book an appointment
          </motion.div>
        </AnimatePresence>

        <Calendar
          fullscreen={false}
          onSelect={handleDateSelect}
          className="rounded-lg"
        />
      </motion.div>

      {/* Appointment Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
        width={420}
        modalRender={(modal) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {modal}
          </motion.div>
        )}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Appointment
          </h2>
          <p className="text-sm text-gray-500">
            Schedule a visit with a doctor
          </p>
        </div>

        <Form layout="vertical">
          <Form.Item label="Date">
            <Input
              value={selectedDate?.format("MMMM DD, YYYY")}
              disabled
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label="Patient Name"
            name="patientName"
            rules={[{ required: true, message: "Please enter patient name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Doctor"
            name="doctor"
            rules={[{ required: true, message: "Please select a doctor" }]}
          >
            <Select placeholder="Select doctor">
              <Select.Option value="Dr. Ella John">Dr. Ella John</Select.Option>
              <Select.Option value="Dr. Alex Brown">
                Dr. Alex Brown
              </Select.Option>
              <Select.Option value="Dr. Michael Stone">
                Dr. Michael Stone
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker use12Hours format="h:mm A" className="w-full" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary">Create Appointment</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BookAppointment;

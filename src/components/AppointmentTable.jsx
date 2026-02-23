import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Table, Avatar, Tag } from "antd";
import { useAppStore } from "../store/useAppStore";
import dayjs from "dayjs";

function AppointmentTable() {
  const { fetchAppointments, appointments } = useAppStore();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter today's appointments based on current date
  const todayStr = dayjs().format("YYYY-MM-DD");
  const todaysAppointments = appointments.filter(
    (appt) => appt.date === todayStr
  );

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patient",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.patientAvatar || "/patients/default.jpg"} />
          <span className="font-medium capitalize">{record.patientName}</span>
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"], // hide on small screens if needed
    },
    {
      title: "Doctor",
      dataIndex: "assignedDoctor",
      key: "doctor",
      responsive: ["sm"], // show on sm+ screens
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status?.toLowerCase() === "completed"
              ? "green"
              : status?.toLowerCase() === "cancelled"
              ? "red"
              : "yellow"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-5 rounded-xl shadow-md min-w-150 md:min-w-full"
      >
        <h2 className="text-sm font-bold mb-4 text-gray-800">
          Today’s Appointments
        </h2>

        <Table
          columns={columns}
          dataSource={todaysAppointments}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: "max-content", y: 420 }}
        />
      </motion.div>
    </div>
  );
}

export default AppointmentTable;
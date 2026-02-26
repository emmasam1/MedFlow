import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Table, Avatar, Tag, ConfigProvider, theme } from "antd";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";
import dayjs from "dayjs";

function AppointmentTable() {
  const { fetchAppointments, appointments } = useAppStore();
  const { darkMode } = useStore();

  useEffect(() => {
    fetchAppointments();
  }, []);

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
          <span className="font-medium capitalize">
            {record.patientName}
          </span>
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
      responsive: ["md"],
    },
    {
      title: "Doctor",
      dataIndex: "assignedDoctor",
      key: "doctor",
      responsive: ["sm"],
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
              : "gold"
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
        className={`p-5 rounded-xl shadow-md min-w-150 md:min-w-full transition-colors duration-300 ${
          darkMode
            ? "bg-[#1a202c] border border-gray-700"
            : "bg-white border border-gray-100"
        }`}
      >
        <h2
          className={`text-sm font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Today’s Appointments
        </h2>

        {/* 🔥 AntD Theme Control */}
        <ConfigProvider
          theme={{
            algorithm: darkMode
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#3B82F6",
              borderRadius: 8,
            },
            components: {
              Table: {
                colorBgContainer: darkMode ? "#1f2937" : "#ffffff",
                headerBg: darkMode ? "#111827" : "#fafafa",
                headerColor: darkMode ? "#ffffff" : "#1f2937",
                rowHoverBg: darkMode ? "#374151" : "#f5f5f5",
                borderColor: darkMode ? "#374151" : "#f0f0f0",
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={todaysAppointments}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: "max-content", y: 420 }}
          />
        </ConfigProvider>
      </motion.div>
    </div>
  );
}

export default AppointmentTable;
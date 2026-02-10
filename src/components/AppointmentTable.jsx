import React from "react";
import { motion } from "framer-motion";
import { Table, Avatar, Tag } from "antd";
import dayjs from "dayjs";

function AppointmentTable() {
  const todaysAppointments = [
    {
      id: 1,
      patientAvatar: "/patients/p1.jpg",
      patientName: "John Doe",
      appointmentTime: "08:30 AM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 2,
      patientAvatar: "/patients/p2.jpg",
      patientName: "Mary Johnson",
      appointmentTime: "09:00 AM",
      doctor: "Dr. Alex Brown",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 3,
      patientAvatar: "/patients/p3.jpg",
      patientName: "Samuel Okoye",
      appointmentTime: "09:30 AM",
      doctor: "Dr. Ella John",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 4,
      patientAvatar: "/patients/p4.jpg",
      patientName: "Aisha Bello",
      appointmentTime: "10:00 AM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 5,
      patientAvatar: "/patients/p5.jpg",
      patientName: "Daniel Smith",
      appointmentTime: "10:30 AM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 6,
      patientAvatar: "/patients/p6.jpg",
      patientName: "Grace Lee",
      appointmentTime: "11:00 AM",
      doctor: "Dr. Alex Brown",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 7,
      patientAvatar: "/patients/p7.jpg",
      patientName: "Ibrahim Musa",
      appointmentTime: "11:30 AM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 8,
      patientAvatar: "/patients/p8.jpg",
      patientName: "Sophia Williams",
      appointmentTime: "12:00 PM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 9,
      patientAvatar: "/patients/p9.jpg",
      patientName: "David Chen",
      appointmentTime: "12:30 PM",
      doctor: "Dr. Alex Brown",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 10,
      patientAvatar: "/patients/p10.jpg",
      patientName: "Fatima Abdullahi",
      appointmentTime: "01:00 PM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 11,
      patientAvatar: "/patients/p11.jpg",
      patientName: "Peter Parker",
      appointmentTime: "01:30 PM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 12,
      patientAvatar: "/patients/p12.jpg",
      patientName: "Linda Martinez",
      appointmentTime: "02:00 PM",
      doctor: "Dr. Alex Brown",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 13,
      patientAvatar: "/patients/p13.jpg",
      patientName: "Chinedu Nwoye",
      appointmentTime: "02:30 PM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 14,
      patientAvatar: "/patients/p14.jpg",
      patientName: "Emily Davis",
      appointmentTime: "03:00 PM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 15,
      patientAvatar: "/patients/p15.jpg",
      patientName: "Mohammed Salim",
      appointmentTime: "03:30 PM",
      doctor: "Dr. Alex Brown",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 16,
      patientAvatar: "/patients/p16.jpg",
      patientName: "Olivia Brown",
      appointmentTime: "04:00 PM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 17,
      patientAvatar: "/patients/p17.jpg",
      patientName: "Kelvin Adams",
      appointmentTime: "04:30 PM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 18,
      patientAvatar: "/patients/p18.jpg",
      patientName: "Zainab Sule",
      appointmentTime: "05:00 PM",
      doctor: "Dr. Alex Brown",
      status: "cancelled",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 19,
      patientAvatar: "/patients/p19.jpg",
      patientName: "Brian Wilson",
      appointmentTime: "05:30 PM",
      doctor: "Dr. Michael Stone",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      id: 20,
      patientAvatar: "/patients/p20.jpg",
      patientName: "Hannah Moore",
      appointmentTime: "06:00 PM",
      doctor: "Dr. Ella John",
      status: "completed",
      appointmentDate: dayjs().format("YYYY-MM-DD"),
    },
  ];

 const columns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patient",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.patientAvatar} />
          <span className="font-medium">{record.patientName}</span>
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "time",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "date",
      responsive: ["md"], // hide on small screens if needed
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      responsive: ["sm"], // show only on small+ screens
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "red"}>
          {status.toUpperCase()}
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
        className="bg-white p-5 rounded-xl shadow-md min-w-[600px] md:min-w-full"
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
        //   className="appointment-table"
        />
      </motion.div>
    </div>
  );
}

export default AppointmentTable;
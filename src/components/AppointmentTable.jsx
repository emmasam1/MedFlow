import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table, Avatar, Tag, ConfigProvider, theme } from "antd";
import { useAppStore } from "../store/useAppStore";
import { useStore } from "../store/store";
import dayjs from "dayjs";

function AppointmentTable() {
  const {
    // fetchAppointments,
    appointments,
    queue,
    getQueue,
    transactions,
    getTransactions,
  } = useAppStore();
  const { darkMode } = useStore();

  const [activeTab, setActiveTab] = useState("appointments");

  const user = useAppStore((state) => state.user);
  const role = user?.role?.toLowerCase();

  const isRecordOfficer = role === "record_officer";
  const isDoctor = role === "doctor";
  const isSpecialist = role === "specialist";
  const isFinance = role === "finance_officer";

  useEffect(() => {
    // fetchAppointments();
    getQueue && getQueue();
    getTransactions && getTransactions();
  }, []);

  const todayStr = dayjs().format("YYYY-MM-DD");

  const todaysAppointments = appointments?.filter(
    (appt) => appt.date === todayStr,
  );

  const todayQueue = queue || [];

  const financeQueue = queue?.filter(
  (q) => q.paymentStatus !== "paid" || q.balance > 0
);

  /* ---------------- APPOINTMENT COLUMNS ---------------- */

  const appointmentColumns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.patientAvatar || "/patients/default.jpg"} />
          <span className="font-medium capitalize">{record.patientName}</span>
        </div>
      ),
    },
    { title: "Time", dataIndex: "time" },
    { title: "Date", dataIndex: "date", responsive: ["md"] },
    { title: "Doctor", dataIndex: "assignedDoctor", responsive: ["sm"] },
    {
      title: "Status",
      dataIndex: "status",
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

  /* ---------------- QUEUE COLUMNS ---------------- */

  const queueColumns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src="/patients/default.jpg" />
          <span className="font-medium capitalize">{record.patientName}</span>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason) => (
        <span className="text-gray-500 text-sm capitalize">
          {reason || "N/A"}
        </span>
      ),
    },
    {
      title: "Time",
      render: (_, record) => dayjs(record.createdAt).format("hh:mm A"),
    },
    {
      title: "priority",
      dataIndex: "priority",
      render: (status) => (
        <Tag
          color={
            status === "Urgent"
              ? "blue"
              : status === "Emergency"
                ? "red"
                : "yellow"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
    },
    {
      title: "Next",
      dataIndex: "nextDepartment",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "done" ? "green" : status === "cancel" ? "red" : "blue"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  /* ---------------- FINANCE COLUMNS ---------------- */
  const financeQueueColumns = [
  { title: "Patient", dataIndex: "patientName" },

  { title: "Service", dataIndex: "service" },

  {
    title: "Total",
    render: (_, r) => <span className="font-semibold">₦{r.labAmount || 0}</span>,
  },

  {
    title: "Paid",
    render: (_, r) => (
      <span className="text-green-500">
        ₦{(r.labAmount || 0) - (r.balance || 0)}
      </span>
    ),
  },

  {
    title: "Balance",
    render: (_, r) => (
      <span className={r.balance > 0 ? "text-red-500" : "text-green-500"}>
        ₦{r.balance || 0}
      </span>
    ),
  },

  {
    title: "Payment",
    dataIndex: "paymentStatus",
    render: (status) => (
      <Tag
        color={
          status === "paid"
            ? "green"
            : status === "partial"
            ? "gold"
            : "red"
        }
      >
        {status?.toUpperCase()}
      </Tag>
    ),
  },
];

  const transactionColumns = [
    { title: "Patient", dataIndex: "patientName" },
    { title: "Service", dataIndex: "service" },

    {
      title: "Amount",
      render: (_, r) => `₦${r.amount}`,
    },

    {
      title: "Method",
      dataIndex: "paymentMethod",
      render: (m) => <Tag color="blue">{m?.toUpperCase()}</Tag>,
    },

    {
      title: "Type",
      dataIndex: "paymentType",
      render: (t) =>
        t ? <Tag color="gold">{t.toUpperCase()}</Tag> : <Tag>FULL</Tag>,
    },

    {
      title: "Time",
      render: (_, r) => dayjs(r.createdAt).format("hh:mm A"),
    },
  ];

  const renderTable = (columns, data) => (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
      size="small"
      scroll={{ x: "max-content", y: 420 }}
    />
  );

  /* ---------------- WHAT TO SHOW ---------------- */

  let content;

  // 👨‍⚕️ DOCTOR → ONLY QUEUE
  if (isDoctor) {
    content = renderTable(queueColumns, todayQueue);
  }

  // 🧠 SPECIALIST → ONLY APPOINTMENTS
  else if (isSpecialist) {
    content = renderTable(appointmentColumns, todaysAppointments);
  }

  // 🗂 RECORD OFFICER → TABS
  else if (isRecordOfficer) {
    content = (
      <>
        {/* 🔥 CUSTOM TOGGLE */}
        <div className="flex gap-2 mb-4 relative">
          {["appointments", "queue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-3 py-1 text-xs font-semibold capitalize"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="sharedTab"
                  className="absolute inset-0 bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}

              <span
                className={`relative z-10 ${
                  activeTab === tab ? "text-white" : "text-gray-500"
                }`}
              >
                {tab}
              </span>
            </button>
          ))}
        </div>

        {/* 🔥 ANIMATED SWITCH */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "appointments"
                ? renderTable(appointmentColumns, todaysAppointments)
                : renderTable(queueColumns, todayQueue)}
            </motion.div>
          </AnimatePresence>
        </div>
      </>
    );
  }  else if (isFinance) {
  content = (
    <div className="space-y-6">
      
      {/* 💰 SUMMARY CARDS */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatMini title="Total Revenue" value={`₦${totalRevenue}`} color="green" />
        <StatMini title="Pending Payments" value={pendingPayments} color="orange" />
        <StatMini title="Today Revenue" value={`₦${todayRevenue}`} color="blue" />
        <StatMini title="Transactions" value={transactions.length} color="purple" />
      </div> */}

      {/* 🧾 PENDING PAYMENTS */}
      <div>
        <p className="text-sm font-semibold mb-2 text-gray-400">
          Pending Payments
        </p>
        {renderTable(financeQueueColumns, financeQueue)}
      </div>

      {/* 💳 TRANSACTIONS */}
      <div>
        <p className="text-sm font-semibold mb-2 text-gray-400">
          Transactions
        </p>
        {renderTable(transactionColumns, transactions)}
      </div>
    </div>
  );
}

  // 👤 DEFAULT → APPOINTMENTS
  else {
    content = renderTable(appointmentColumns, todaysAppointments);
  }

  return (
    <div className="w-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-xl shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-[#1a202c] border border-gray-700"
            : "bg-white border border-gray-100"
        }`}
      >
       <div className="flex justify-between items-center">
         <h2
          className={`text-sm font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {isFinance
            ? "Finance History"
            : isDoctor
              ? "Patient Queue"
              : isSpecialist
                ? "Appointments"
                : isRecordOfficer
                  ? "Records Management"
                  : "Today’s Appointments"}
        </h2>

        {isFinance ? <button className="hover:bg-[#9DCEF8] px-3 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer">Download Transaction Record</button> : ""} 
       </div>

        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#3B82F6",
              borderRadius: 8,
            },
          }}
        >
          {content}
        </ConfigProvider>
      </motion.div>
    </div>
  );
}

export default AppointmentTable;

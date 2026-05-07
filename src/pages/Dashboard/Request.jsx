import React, { useState } from "react";
import {
  HiOutlineInboxIn,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineChatAlt2,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineLightningBolt,
  HiOutlinePlus
} from "react-icons/hi";
import { Tag, Tooltip, Button, Input } from "antd";
import CustomTable from "../../components/CustomTable";
import StatCard from "../../components/StatCard"; // Integrated StatCard
import Modal from "../../components/Modal";
import { useStore } from "../../store/store";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

const MOCK_DATA = [
  {
    id: "REQ-001",
    department: "Pharmacy",
    item: "Insulin Glargine",
    quantity: 20,
    requestedBy: "Pharm. Yusuf",
    status: "Pending",
    urgency: "High",
    date: "2026-05-05",
  },
  {
    id: "REQ-002",
    department: "Surgery",
    item: "Scalpel Blades #10",
    quantity: 100,
    requestedBy: "Dr. Adebayo",
    status: "Approved",
    urgency: "Normal",
    date: "2026-05-04",
  },
  {
    id: "REQ-003",
    department: "Nursing",
    item: "Cotton Wool",
    quantity: 15,
    requestedBy: "Nurse Chidi",
    status: "Rejected",
    urgency: "Normal",
    date: "2026-05-04",
    reason: "Insufficient stock in main store",
  },
  {
    id: "REQ-004",
    department: "Emergency",
    item: "Oxygen Masks",
    quantity: 10,
    requestedBy: "Dr. Smith",
    status: "Pending",
    urgency: "High",
    date: "2026-05-05",
  },
  {
    id: "REQ-005",
    department: "Radiology",
    item: "Lead Aprons",
    quantity: 2,
    requestedBy: "Tech Sarah",
    status: "Approved",
    urgency: "Normal",
    date: "2026-05-03",
  },
  {
    id: "REQ-006",
    department: "Lab",
    item: "Test Tubes",
    quantity: 50,
    requestedBy: "John Doe",
    status: "Pending",
    urgency: "Normal",
    date: "2026-05-05",
  },
  {
    id: "REQ-007",
    department: "Pediatrics",
    item: "Infant Paracetamol",
    quantity: 30,
    requestedBy: "Dr. Grace",
    status: "Pending",
    urgency: "Normal",
    date: "2026-05-05",
  },
  {
    id: "REQ-008",
    department: "Pharmacy",
    item: "Amoxicillin",
    quantity: 40,
    requestedBy: "Pharm. Yusuf",
    status: "Rejected",
    urgency: "High",
    date: "2026-05-02",
    reason: "Wrong department coding",
  },
  {
    id: "REQ-009",
    department: "Surgery",
    item: "Surgical Gloves",
    quantity: 200,
    requestedBy: "Dr. Adebayo",
    status: "Approved",
    urgency: "High",
    date: "2026-05-01",
  },
  {
    id: "REQ-010",
    department: "ICU",
    item: "Ventilator Circuits",
    quantity: 5,
    requestedBy: "Nurse Joy",
    status: "Pending",
    urgency: "High",
    date: "2026-05-05",
  },
];

const Request = () => {
  const { darkMode } = useStore();
  const [requests, setRequests] = useState(MOCK_DATA);
  const [selectedReq, setSelectedReq] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAppStore((state) => state.user);
  
    const role = user?.role?.toLowerCase();

  // Calculate Stats for the top row
  const stats = [
    {
      title: "Total Requests",
      value: requests.length,
      icon: <HiOutlineClipboardList />,
      color: "blue",
    },
    {
      title: "Pending Review",
      value: requests.filter((r) => r.status === "Pending").length,
      icon: <HiOutlineInboxIn />,
      color: "orange",
    },
    {
      title: "High Urgency",
      value: requests.filter(
        (r) => r.status === "Pending" && r.urgency === "High",
      ).length,
      icon: <HiOutlineLightningBolt />,
      color: "red",
    },
    {
      title: "Fulfilled Today",
      value: requests.filter((r) => r.status === "Approved").length,
      icon: <HiOutlineCheckCircle />,
      color: "green",
    },
  ];

  const closeModal = () => {
    setSelectedReq(null);
    setIsRejecting(false);
    setRejectionReason("");
  };

  const handleStatusUpdate = (id, status) => {
    if (status === "Rejected" && !rejectionReason.trim()) {
      return toast.error("Please provide a reason for rejection");
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reason: status === "Rejected" ? rejectionReason : r.reason,
            }
          : r,
      ),
    );
    toast.success(`Request ${status} successfully`);
    closeModal();
  };

  const columns = [
    {
      title: "Request ID",
      key: "id",
      render: (id) => <span className="font-bold text-blue-600">{id}</span>,
    },
    {
      title: "Source Dept",
      key: "department",
      render: (dept) => <span className="font-semibold">{dept}</span>,
    },
    {
      title: "Item Details",
      key: "item",
      render: (_, r) => (
        <div>
          <p className="font-bold m-0">{r.item}</p>
          <p className="text-xs text-slate-500 m-0">Qty: {r.quantity}</p>
        </div>
      ),
    },
    {
      title: "Urgency",
      key: "urgency",
      render: (u) => (
        <Tag color={u === "High" ? "volcano" : "blue"} className="font-bold">
          {u.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (s) => {
        const colors = { Approved: "green", Pending: "gold", Rejected: "red" };
        return (
          <Tag
            color={colors[s]}
            className="font-black rounded-full px-3 text-[10px]"
          >
            {s.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const buttonMotion = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";


  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>

        <h1
          className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          Store Requisitions
        </h1>
       {user?.role !== "store_officer" ? null :  <p className="text-slate-500 text-sm">
          Overview of all department inventory requests.
        </p>}
        </div>
        
        {user?.role === "store_officer" ? null : <div className="flex items-center gap-3">
                    <motion.button {...buttonMotion} className={buttonStyle}>
                      <HiOutlinePlus />
                      New Purchase Order
                    </motion.button>
                  </div>}
      </div>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Requests Table */}
      <CustomTable
        title="Incoming Queue"
        columns={columns}
        data={requests}
        searchableKeys={["id", "department", "item", "requestedBy"]}
        actions={(row) => (
          <Tooltip title="Process Request">
            <button
              onClick={() => setSelectedReq(row)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
            >
              <HiOutlineEye size={20} />
            </button>
          </Tooltip>
        )}
      />

      {/* Fulfillment Modal */}
      <Modal isOpen={!!selectedReq} onClose={closeModal} title="">
        {selectedReq && (
          <div>
            {/* Header with Glassmorphism effect */}
            <div className="relative bg-blue-700 p-8 text-white">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <HiOutlineInboxIn size={120} />
              </div>
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <Tag
                    color="blue"
                    className="mb-2 bg-blue-500/30 border-none text-white font-bold backdrop-blur-md"
                  >
                    OFFICIAL REQUISITION
                  </Tag>
                  <h2 className="text-3xl font-black tracking-tight m-0 uppercase">
                    {selectedReq.id}
                  </h2>
                  <p className="opacity-80 text-xs font-medium mt-1 flex items-center gap-1">
                    <HiOutlineCalendar /> Submitted on {selectedReq.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                    Priority
                  </p>
                  <Tag
                    color={
                      selectedReq.urgency === "High" ? "#f5222d" : "#1890ff"
                    }
                    className="m-0 border-none font-black px-4 rounded-full"
                  >
                    {selectedReq.urgency}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="p-6 -mt-4 relative z-20">
              {/* Info Card */}
              <div
                className={`grid grid-cols-2 gap-4 p-4 rounded-xl shadow-sm border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
              >
                <div className="border-r border-slate-100 dark:border-slate-700 px-2">
                  <p className="text-[10px] text-black uppercase tracking-widest mb-1">
                    Source Department
                  </p>
                  <p
                    className={`font-bold text-base ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {selectedReq.department}
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[10px] text-black uppercase tracking-widest mb-1">
                    Requested By
                  </p>
                  <p className="font-bold text-base">
                    {selectedReq.requestedBy}
                  </p>
                </div>
              </div>

              {/* Item Details Section */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-[.5px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-[10px] font-black text-black uppercase">
                    Item to Issue
                  </span>
                  <div className="h-[.5px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>

                <div
                  className={`flex items-center justify-between p-5 ronded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/40" : "border-blue-100 bg-blue-50/30"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                      <HiOutlineClipboardList size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg m-0 leading-tight">
                        {selectedReq.item}
                      </h3>
                      <p className="text-xs opacity-60">
                        Inventory Unit ID: #STR-
                        {Math.floor(Math.random() * 1000)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black opacity-40 uppercase">
                      Quantity
                    </span>
                    <span className="text-3xl  text-blue-600">
                      {selectedReq.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Zone */}
              <div className="mt-8">
                {selectedReq.status === "Pending" ? (
                  <div className="space-y-4">
                    {!isRejecting ? (
                      <div className="flex gap-4">
                        <button
                          className="group flex-[2] h-14 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-lg hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                          onClick={() => setIsRejecting(true)}
                        >
                          <HiOutlineXCircle
                            size={22}
                            className="group-hover:rotate-90 transition-transform"
                          />
                          Decline
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(selectedReq.id, "Approved")
                          }
                          type="submit"
                          disabled={isSubmitting}
                          className={`bg-blue-600 text-white py-2 px-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting && (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>

                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                          )}
                          {/* {isSubmitting
                  ? "Updating..."
                  : "Creating..."
                } */}
                          <HiOutlineCheckCircle size={24} />
                          Approve & Release
                        </button>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-top-4 duration-300 bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-2 text-red-600 mb-3">
                          <HiOutlineChatAlt2 size={20} />
                          <label className="text-xs font-black uppercase">
                            Internal Note for Rejection
                          </label>
                        </div>
                        <Input.TextArea
                          rows={3}
                          placeholder="Provide a reason for the department head..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="rounded-xl border-none shadow-inner bg-white dark:bg-slate-800 p-3"
                        />
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => setIsRejecting(false)}
                            className="flex-1 h-10 font-bold rounded-xl border-none bg-white"
                          >
                            Back
                          </Button>
                          <Button
                            danger
                            type="primary"
                            className="flex-1 h-10 font-black rounded-xl shadow-lg shadow-red-200 border-none"
                            onClick={() =>
                              handleStatusUpdate(selectedReq.id, "Rejected")
                            }
                          >
                            Confirm Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-2xl flex items-center justify-between ${selectedReq.status === "Approved" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedReq.status === "Approved" ? (
                          <HiOutlineCheckCircle size={28} />
                        ) : (
                          <HiOutlineXCircle size={28} />
                        )}
                        <div>
                          <p className="text-[10px] uppercase m-0 leading-none">
                            Current Status
                          </p>
                          <p className="text-lg font-bold m-0 uppercase tracking-tight">
                            {selectedReq.status}
                          </p>
                        </div>
                      </div>
                      <HiOutlineLightningBolt
                        className="opacity-20"
                        size={30}
                      />
                    </div>

                    {selectedReq.reason && (
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Auditor Note:
                        </p>
                        <p className="text-sm text-white font-medium italic m-0">
                          "{selectedReq.reason}"
                        </p>
                      </div>
                    )}

                    <button
                      onClick={closeModal}
                      className="w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl border-none cursor-pointer hover:opacity-90 transition-opacity uppercase tracking-widest text-xs"
                    >
                      Dismiss View
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Request;

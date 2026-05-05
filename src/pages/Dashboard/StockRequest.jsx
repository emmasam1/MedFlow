import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { Tag, Tooltip, Modal, Select, InputNumber, Input } from "antd";
import StatCard from "../../components/StatCard";
import CustomTable from "../../components/CustomTable";
import { useStore } from "../../store/store";
import toast from "react-hot-toast";

const MOCK_REQUESTS = [
  {
    id: "REQ-9921",
    item: "Surgical Gloves (M)",
    quantity: 50,
    department: "Surgery",
    requestedBy: "Dr. Smith",
    date: "2024-03-15",
    status: "Pending",
    urgency: "High",
  },
  {
    id: "REQ-9922",
    item: "Paracetamol 500mg",
    quantity: 200,
    department: "Pharmacy",
    requestedBy: "Pharm. Jane",
    date: "2024-03-14",
    status: "Approved",
    urgency: "Normal",
  },
];

const StockRequest = () => {
  const { darkMode } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  // Stats Logic
  const statData = [
    { title: "Total Requests", value: requests.length, color: "blue" },
    {
      title: "Pending",
      value: requests.filter((r) => r.status === "Pending").length,
      color: "yellow",
    },
    {
      title: "Approved",
      value: requests.filter((r) => r.status === "Approved").length,
      color: "green",
    },
  ];

  const columns = [
    {
      title: "Request ID",
      key: "id",
      render: (id) => <span className="font-bold text-blue-600">{id}</span>,
    },
    {
      title: "Item & Qty",
      key: "item",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-bold">{record.item}</span>
          <span className="text-xs opacity-60">Qty: {record.quantity}</span>
        </div>
      ),
    },
    { title: "Department", key: "department" },
    { title: "Requested By", key: "requestedBy" },
    {
      title: "Urgency",
      key: "urgency",
      render: (val) => (
        <Tag color={val === "High" ? "volcano" : "blue"} className="font-bold">
          {val.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (status) => {
        const colors = { Pending: "gold", Approved: "green", Rejected: "red" };
        return (
          <Tag color={colors[status]} className="font-bold">
            {status}
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
    <div className="px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2
            className={`text-2xl font-black flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            <HiOutlineDocumentText className="text-blue-600" />
            Stock Requisition
          </h2>
          <p className="text-gray-500 text-sm">
            Create and track internal stock requests across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button {...buttonMotion} className={buttonStyle}>
            <HiOutlinePlus /> Add New Item
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table */}
      <CustomTable
        title="Recent Requests"
        columns={columns}
        data={requests}
        searchableKeys={["id", "item", "department", "requestedBy"]}
        // breadcrumb={["Inventory", "Requisition"]}
        exportFileName="Stock_Requests"
        actions={(row) => (
          <div className="flex gap-2">
            {row.status === "Pending" && (
              <>
                <Tooltip title="Approve">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <HiOutlineCheckCircle size={18} />
                  </button>
                </Tooltip>
                <Tooltip title="Reject">
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <HiOutlineXCircle size={18} />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        )}
      />

      {/* Request Modal */}
      <Modal
        title={<span className="font-black text-xl">New Stock Request</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        className={darkMode ? "dark-modal" : ""}
      >
        <div className="flex flex-col gap-4 mt-6">
          <div>
            <label className="text-xs font-bold uppercase opacity-60">
              Select Item
            </label>
            <Select
              className="w-full mt-1"
              placeholder="Search items in inventory..."
              showSearch
              options={[
                { value: "Surgical Gloves", label: "Surgical Gloves (M)" },
                { value: "Paracetamol", label: "Paracetamol 500mg" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase opacity-60">
                Quantity
              </label>
              <InputNumber className="w-full mt-1" min={1} defaultValue={1} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase opacity-60">
                Urgency
              </label>
              <Select
                className="w-full mt-1"
                defaultValue="Normal"
                options={[
                  { value: "Normal", label: "Normal" },
                  { value: "High", label: "High (Urgent)" },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase opacity-60">
              Department
            </label>
            <Input className="mt-1" placeholder="e.g. Pediatrics" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase opacity-60">
              Reason/Notes
            </label>
            <Input.TextArea
              className="mt-1"
              rows={3}
              placeholder="Why is this needed?"
            />
          </div>

          <button
            onClick={() => {
              toast.success("Request Submitted Successfully");
              setIsModalOpen(false);
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Submit Request
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StockRequest;

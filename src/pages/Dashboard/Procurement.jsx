import React, { useState } from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineBadgeCheck,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineOfficeBuilding,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { Tag, Tooltip, Button, Input, Steps } from "antd";
import CustomTable from "../../components/CustomTable";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import { useStore } from "../../store/store";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_PROCUREMENTS = [
  {
    id: "PO-2026-001",
    vendor: "Global Med Equipment",
    item: "MRI Scanner Parts",
    cost: 15000,
    status: "Pending",
    priority: "Urgent",
    date: "2026-05-01",
  },
  {
    id: "PO-2026-002",
    vendor: "City Pharma Ltd",
    item: "Bulk Antibiotics",
    cost: 4200,
    status: "Ordered",
    priority: "Normal",
    date: "2026-05-02",
  },
  {
    id: "PO-2026-003",
    vendor: "Apex Logistics",
    item: "Disposable Syringes",
    cost: 850,
    status: "Delivered",
    priority: "Normal",
    date: "2026-04-28",
  },
  {
    id: "PO-2026-004",
    vendor: "Oxygen Plus",
    item: "Oxygen Concentrators",
    cost: 12000,
    status: "Under Review",
    priority: "High",
    date: "2026-05-04",
  },
  {
    id: "PO-2026-005",
    vendor: "SurgiPath Inc",
    item: "Surgical Kits",
    cost: 3100,
    status: "Pending",
    priority: "Normal",
    date: "2026-05-05",
  },
];

const Procurement = () => {
  const { darkMode } = useStore();
  const [orders, setOrders] = useState(MOCK_PROCUREMENTS);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stats = [
    {
      title: "Active Orders",
      value: orders.length,
      icon: <HiOutlineShoppingCart />,
      color: "blue",
    },
    {
      title: "Pending Approval",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: <HiOutlineDocumentText />,
      color: "orange",
    },
    {
      title: "Monthly Spend",
      value: "$35,150",
      icon: <HiOutlineCash />,
      color: "green",
    },
    {
      title: "Awaiting Delivery",
      value: orders.filter((o) => o.status === "Ordered").length,
      icon: <HiOutlineTruck />,
      color: "purple",
    },
  ];

  const columns = [
    {
      title: "PO Number",
      key: "id",
      render: (id) => <span className="font-bold text-blue-600">{id}</span>,
    },
    {
      title: "Vendor",
      key: "vendor",
      render: (v) => (
        <span className="font-semibold flex items-center gap-2">
          <HiOutlineOfficeBuilding className="text-slate-400" /> {v}
        </span>
      ),
    },
    { title: "Description", key: "item" },
    {
      title: "Total Value",
      key: "cost",
      render: (val) => (
        <span className="font-bold">${val.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (s) => {
        const colors = {
          Pending: "orange",
          Ordered: "blue",
          Delivered: "green",
          "Under Review": "purple",
        };
        return (
          <Tag color={colors[s]} className="font-bold rounded-full px-3">
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
    <div className="p-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2
            className={`text-2xl font-black flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            Procurement & Sourcing
          </h2>
          <p className="text-gray-500 text-sm">
            Manage purchase orders and vendor supply chains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button {...buttonMotion} className={buttonStyle}>
            <HiOutlinePlus />
            New Purchase Order
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Main Table */}
      <CustomTable
        title="Recent Purchase Orders"
        columns={columns}
        data={orders}
        actions={(row) => (
          <Tooltip title="View PO Details">
            <button
              onClick={() => setSelectedOrder(row)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
            >
              <HiOutlineEye size={20} />
            </button>
          </Tooltip>
        )}
      />

      {/* Modern Procurement Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div>
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white relative">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineShoppingCart className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      Supply Chain Division
                    </span>
                  </div>
                  <h2 className="text-3xl font-black m-0 tracking-tight">
                    {selectedOrder.id}
                  </h2>
                </div>
                <Tag
                  color="gold"
                  className="m-0 border-none px-4 font-black rounded-full uppercase py-1"
                >
                  {selectedOrder.status}
                </Tag>
              </div>
            </div>

            <div className="p-8">
              {/* Progress Tracker */}
              <div className="mb-10 px-4">
                <Steps
                  size="small"
                  current={selectedOrder.status === "Pending" ? 0 : 1}
                  items={[
                    { title: "Draft" },
                    { title: "Approved" },
                    { title: "Ordered" },
                    { title: "Shipped" },
                  ]}
                />
              </div>

              {/* Order Info Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                    Vendor Details
                  </p>
                  <p className="font-bold text-lg m-0">
                    {selectedOrder.vendor}
                  </p>
                  <p className="text-xs text-blue-500 font-medium">
                    Verified Supplier ✅
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                    Order Value
                  </p>
                  <p className="font-black text-2xl m-0 text-green-600">
                    ${selectedOrder.cost.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    VAT Inclusive (7.5%)
                  </p>
                </div>
              </div>

              {/* Items Table (Simple representation) */}
              <div className="mb-8 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 text-[10px] font-black text-slate-400 uppercase flex justify-between">
                  <span>Item Description</span>
                  <span>Allocation</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <p className="font-bold m-0">{selectedOrder.item}</p>
                  <Tag className="font-bold rounded-lg border-none bg-blue-100 text-blue-700">
                    Main Warehouse
                  </Tag>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4">
                <button
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 font-black rounded-2xl border-none cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.error("Cancellation protocol initiated");
                    setSelectedOrder(null);
                  }}
                >
                  <HiOutlineXCircle size={20} /> VOID ORDER
                </button>
                <button
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl border-none cursor-pointer hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.success("Purchase order released to vendor");
                    setSelectedOrder(null);
                  }}
                >
                  <HiOutlineCheckCircle size={20} /> APPROVE PURCHASE
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Procurement;

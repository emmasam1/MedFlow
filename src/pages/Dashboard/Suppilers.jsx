import React, { useState } from "react";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineIdentification,
  HiOutlineBadgeCheck,
  HiOutlineXCircle,
  HiOutlineSearch,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tooltip, Tag, Input, Select } from "antd";
import CustomTable from "../../components/CustomTable";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import { useStore } from "../../store/store";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_SUPPLIERS = [
  {
    id: "VEN-001",
    name: "Global Med Equipment",
    contactPerson: "Alice Johnson",
    phone: "+234 801 234 5678",
    email: "sales@globalmed.com",
    category: "Equipment",
    status: "Active",
    rating: 4.8,
  },
  {
    id: "VEN-002",
    name: "City Pharma Ltd",
    contactPerson: "Bob Williams",
    phone: "+234 802 999 8888",
    email: "orders@citypharma.com",
    category: "Drugs",
    status: "Active",
    rating: 4.5,
  },
  {
    id: "VEN-003",
    name: "Oxygen Plus",
    contactPerson: "Sarah Yusuf",
    phone: "+234 703 111 2222",
    email: "delivery@oxygenplus.net",
    category: "Medical Gas",
    status: "Inactive",
    rating: 3.2,
  },
  {
    id: "VEN-004",
    name: "SurgiPath Inc",
    contactPerson: "Dr. Kelvin",
    phone: "+234 815 444 3333",
    email: "info@surgipath.com",
    category: "Surgicals",
    status: "Active",
    rating: 4.9,
  },
  {
    id: "VEN-005",
    name: "BioLab Solutions",
    contactPerson: "Janet Doe",
    phone: "+234 901 555 6666",
    email: "contact@biolab.ng",
    category: "Laboratory",
    status: "Active",
    rating: 4.2,
  },
];

const Suppliers = () => {
  const { darkMode } = useStore();
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const user = useAppStore((state) => state.user);

  const role = user?.role?.toLowerCase();

  const buttonMotion = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  // Stats Logic
  const stats = [
    {
      title: "Total Suppliers",
      value: suppliers.length,
      icon: <HiOutlineOfficeBuilding />,
      color: "blue",
    },
    {
      title: "Verified Active",
      value: suppliers.filter((s) => s.status === "Active").length,
      icon: <HiOutlineBadgeCheck />,
      color: "green",
    },
    {
      title: "Inactive Vendors",
      value: suppliers.filter((s) => s.status === "Inactive").length,
      icon: <HiOutlineXCircle />,
      color: "red",
    },
  ];

  const columns = [
    {
      title: "Supplier Entity",
      key: "name",
      render: (text, r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold">
            {text.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">
              {text}
            </span>
            <span className="text-[10px] font-mono text-black uppercase">
              {r.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Contact Details",
      key: "email",
      render: (_, r) => (
        <div className="space-y-1">
          <p className="m-0 text-xs font-medium flex items-center gap-1.5">
            <HiOutlineMail className="text-slate-400" /> {r.email}
          </p>
          <p className="m-0 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <HiOutlinePhone className="text-slate-400" /> {r.phone}
          </p>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (cat) => (
        <Tag
          color="cyan"
          className="font-bold border-none px-3 rounded-md uppercase text-[10px]"
        >
          {cat}
        </Tag>
      ),
    },
    {
      title: "Health",
      key: "status",
      render: (s) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${s === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          ></div>
          <span
            className={`text-xs font-black uppercase tracking-tighter ${s === "Active" ? "text-green-600" : "text-red-600"}`}
          >
            {s}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Vendor Directory
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and monitor hospital supply chain partners.
          </p>
        </div>
        {user?.role === "store_officer" && (
          <div className="flex items-center gap-3">
            <motion.button {...buttonMotion} className={buttonStyle}>
              <HiOutlinePlus />
              Register Supplier
            </motion.button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Supplier List */}
      <CustomTable
        title="Active Supply Partners"
        columns={columns}
        data={suppliers}
        searchableKeys={["name", "id", "category", "contactPerson"]}
        actions={
        user?.role === "store_officer" && (
            (row) => (
          <div className="flex items-center gap-1">
            <Tooltip title="View Profile">
              <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors border-none bg-transparent cursor-pointer">
                <HiOutlineExternalLink size={18} />
              </button>
            </Tooltip>
            <Tooltip title="Edit Partner">
              <button className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-colors border-none bg-transparent cursor-pointer">
                <FiEdit2 size={16} />
              </button>
            </Tooltip>
            <Tooltip title="Remove">
              <button className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-colors border-none bg-transparent cursor-pointer">
                <FiTrash2 size={16} />
              </button>
            </Tooltip>
          </div>
        )
        )}    
        
      />

      {/* Register Supplier Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div
          className={`overflow-hidden rounded-3xl max-w-xl mx-auto shadow-2xl ${darkMode ? "bg-slate-900" : "bg-white"}`}
        >
          {/* Modal Branding Header */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <HiOutlineOfficeBuilding size={150} />
            </div>
            <div className="relative z-10">
              <Tag
                color="blue"
                className="mb-2 border-none font-black text-[10px] px-3 bg-blue-600 text-white"
              >
                SYSTEM REGISTRY
              </Tag>
              <h2 className="text-2xl font-black m-0 tracking-tight">
                Onboard New Supplier
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                Enter vendor credentials to enable procurement.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Company Info Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Business Identity
                  </span>
                </div>
                <Input
                  size="large"
                  prefix={
                    <HiOutlineOfficeBuilding className="text-slate-300" />
                  }
                  placeholder="Official Company Name"
                  className="rounded-2xl h-14 border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    size="large"
                    prefix={
                      <HiOutlineIdentification className="text-slate-300" />
                    }
                    placeholder="Category (e.g. Drugs)"
                    className="rounded-2xl h-14 border-slate-100"
                  />
                  <Input
                    size="large"
                    prefix={<HiOutlineUser className="text-slate-300" />}
                    placeholder="Primary Contact Rep"
                    className="rounded-2xl h-14 border-slate-100"
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Contact Channels
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    size="large"
                    prefix={<HiOutlinePhone className="text-slate-300" />}
                    placeholder="Support Hotline"
                    className="rounded-2xl h-14 border-slate-100"
                  />
                  <Input
                    size="large"
                    prefix={<HiOutlineMail className="text-slate-300" />}
                    placeholder="Bidding Email"
                    className="rounded-2xl h-14 border-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 mt-12">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-4 font-black text-slate-400 rounded-2xl bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-none transition-all cursor-pointer uppercase text-[10px] tracking-widest"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  toast.success("Vendor successfully registered");
                  setIsAddModalOpen(false);
                }}
                className="flex-[2] py-4 font-black text-white rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all border-none cursor-pointer uppercase text-[10px] tracking-widest"
              >
                Finalize Onboarding
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Suppliers;

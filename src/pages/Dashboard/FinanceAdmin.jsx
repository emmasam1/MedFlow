import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Form, Tooltip, Row, Col, Skeleton, Avatar } from "antd";
import {
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiBarChartGroupedLine,
  RiArrowUpLine,
  RiErrorWarningLine,
  RiSearchLine,
  RiFilter3Line,
  RiCalendarCheckLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiArrowDropDownLine,
  RiAiGenerate 
} from "react-icons/ri";
import StatCard from "../../components/StatCard";

// --- Mock Data for the Gatekeeper Flow ---
const TRANSACTIONS = [
  { id: "TX-901", patient: "John Ibrahim", service: "Lab: Malaria Parasite", cost: 2500, status: "cleared", dept: "Laboratory", time: "10:05 AM" },
  { id: "TX-902", patient: "Sarah Bello", service: "Pharmacy: Amoxicillin", cost: 4200, status: "pending", dept: "Pharmacy", time: "10:12 AM" },
  { id: "TX-903", patient: "Emeka Obi", service: "Radiology: Chest X-Ray", cost: 12500, status: "cleared", dept: "Radiology", time: "09:45 AM" },
  { id: "TX-904", patient: "Samuel Ade", service: "Surgery: Appendectomy", cost: 250000, status: "pending", dept: "Theatre", time: "10:20 AM" },
];

const stats = [
  {
    title: "Total Revenue",
    // value: users.length,
    color: "blue",
  },
  {
    title: "Cleared Transaction", // <--- The new critical metric
    // value: 0,
    color: "purple",
  },
  {
    title: "Total Transactions",
    // value: users.filter((u) => u.isActive).length,
    color: "green",
  },
  {
    title: "Pending",
    // value: users.filter((u) => !u.isActive).length,
    color: "red",
  },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Cleared", value: "cleared" },
  { label: "Pending", value: "pending" },
];

const DEPT_OPTIONS = [
  { label: "All Dept", value: "all" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Laboratory", value: "Laboratory" },
  { label: "Radiology", value: "Radiology" },
  { label: "Theatre", value: "Theatre" },
];

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const FinanceAdmin = () => {
  const [filters, setFilters] = useState({
    status: "all",   // ✅ this is the key
    department: "all",
    search: "",
  });
  const [activeTab, setActiveTab] = useState("today");
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="px-4 min-h-screen font-sans">
      {/* 1. Header & Quick Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Oversight</h1>
          <p className="text-sm text-gray-500">Real-time revenue and service clearance tracking</p>
        </div>

        <div className="flex flex-wrap gap-1 mb-6 items-center">

          <FilterDropdown
            label="Filter Status"
            value={filters.status}
            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
            options={STATUS_OPTIONS}
          />

          <FilterDropdown
            label="Filter Department"
            value={filters.department}
            onChange={(val) => setFilters(f => ({ ...f, department: val }))}
            options={DEPT_OPTIONS}
          />

          <FilterDropdown
            label="Filter Period"
            value={filters.period}
            onChange={(val) => setFilters(f => ({ ...f, period: val }))}
            options={PERIOD_OPTIONS}
          />

          <motion.button
            className="hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-1 transition-colors duration-300 text-xs cursor-pointer border-none shadow-sm bg-white"
          >
            <RiAiGenerate size={15} /> Generate Report
          </motion.button>

        </div>








      </div>

      {/* 2. Revenue Pulse (Top Cards) */}
      <div className="">

        {/* 2. Quick Stats Section */}
        <Row gutter={[16, 16]} className="mb-8">
          {isLoading
            ? // Show 4 skeletons while loading
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Col xs={24} sm={12} lg={6} key={`skeleton-${index}`}>
                  <StatSkeleton />
                </Col>
              ))
            : // Show actual stats once loaded
            stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  color={stat.color}
                />
              </Col>
            ))}
        </Row>
      </div>

      {/* 3. Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Real-time Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Live Service Pipeline</h3>
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient or ID..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Patient / ID</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Dept</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TRANSACTIONS.map((tx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 text-sm">{tx.patient}</span>
                          <span className="text-[10px] text-gray-400">{tx.id} • {tx.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.service}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold uppercase">
                          {tx.dept}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">₦{tx.cost.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Departmental Analytics */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <RiBarChartGroupedLine className="text-blue-500" /> Revenue by Dept
              </h3>
            </div>
            <div className="space-y-4">
              <DeptProgress label="Pharmacy" amount="₦145,000" percentage={65} color="bg-blue-500" />
              <DeptProgress label="Laboratory" amount="₦89,200" percentage={40} color="bg-purple-500" />
              <DeptProgress label="Consultation" amount="₦210,000" percentage={85} color="bg-emerald-500" />
              <DeptProgress label="Radiology" amount="₦56,000" percentage={25} color="bg-amber-500" />
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">Cash on Hand</h3>
              <h2 className="text-3xl font-bold mb-4">₦184,200</h2>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Vault: ₦150k</span>
                <span>POS: ₦34.2k</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <RiMoneyDollarCircleLine size={120} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-Components ---


const StatusBadge = ({ status }) => {
  const isCleared = status === "cleared";
  return (
    <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase px-3 py-1 rounded-full w-fit ${isCleared ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isCleared ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
      {status}
    </div>
  );
};

const DeptProgress = ({ label, amount, percentage, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-400">{amount}</span>
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const StatusFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: "All Status", value: "all" },
    { label: "Cleared", value: "cleared" },
    { label: "Pending", value: "pending" },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all shadow-sm
        ${isOpen ? "bg-blue-50 border-[#6777ef] text-[#6777ef]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
      >
        <span>{selected?.label}</span>
        <RiArrowDownSLine className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-2">
              Filter Status
            </p>

            {options.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition
                  ${value === item.value
                    ? "bg-blue-50 text-[#6777ef]"
                    : "text-slate-600 hover:bg-gray-50"
                  }`}
              >
                {item.label}
                {value === item.value && <RiCheckLine className="text-[#6777ef]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // ✅ fixed
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)} // ✅ FIXED
        className="flex items-center gap-2 px-4 py-2  rounded-3xl text-sm font-semibold transition-all shadow-sm bg-white text-gray-600 hover:bg-gray-50"
      >
        <span>{selected.label}</span>
        <RiArrowDropDownLine
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-[9999] p-2"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-2">
              {label}
            </p>

            {options.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition
                  ${value === item.value
                    ? "bg-blue-50 text-[#6777ef]"
                    : "text-slate-600 hover:bg-gray-50"
                  }`}
              >
                {item.label}
                {value === item.value && <RiCheckLine />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FinanceAdmin;











// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   RiMoneyDollarCircleLine,
//   RiTimeLine,
//   RiShieldCheckLine,
//   RiErrorWarningLine,
//   RiEyeLine,
//   RiCloseLine,
//   RiPrinterLine,
//   RiFileTextLine,
//   RiCheckDoubleLine,
//   RiBankCardLine,
//   RiSearchLine,
//   RiFilter3Line
// } from "react-icons/ri";

// // --- Mock Data ---
// const TRANSACTIONS = [
//   { id: "TX-901", patient: "John Ibrahim", service: "Lab: Malaria Parasite", cost: 2500, status: "cleared", dept: "Laboratory", time: "10:05 AM", paymentMethod: "Cash" },
//   { id: "TX-902", patient: "Sarah Bello", service: "Pharmacy: Amoxicillin", cost: 4200, status: "pending", dept: "Pharmacy", time: "10:12 AM", paymentMethod: "Pending" },
//   { id: "TX-903", patient: "Emeka Obi", service: "Radiology: Chest X-Ray", cost: 12500, status: "cleared", dept: "Radiology", time: "09:45 AM", paymentMethod: "POS" },
//   { id: "TX-904", patient: "Samuel Ade", service: "Surgery: Appendectomy", cost: 250000, status: "pending", dept: "Theatre", time: "10:20 AM", paymentMethod: "Pending" },
// ];

// const FinanceAdmin = () => {
//   const [selectedTx, setSelectedTx] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleOpenModal = (tx) => {
//     setSelectedTx(tx);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
//       {/* 1. Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Oversight</h1>
//           <p className="text-sm text-gray-500 font-medium">Monitor inflows and approve service clearances.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="relative hidden md:block">
//             <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search Transaction..."
//               className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none w-64"
//             />
//           </div>
//           <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
//             <RiFilter3Line size={20} />
//           </button>
//         </div>
//       </div>

//       {/* 2. Top Stats - The "Gatekeeper" Pulse */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard label="Today's Revenue" value="₦842,500" icon={<RiMoneyDollarCircleLine />} color="text-blue-600" bg="bg-blue-50" />
//         <StatCard label="Pending Clearances" value="14" icon={<RiTimeLine />} color="text-amber-600" bg="bg-amber-50" />
//         <StatCard label="HMO Claims" value="₦320,000" icon={<RiShieldCheckLine />} color="text-purple-600" bg="bg-purple-50" />
//         <StatCard label="Risk Alerts" value="0" icon={<RiErrorWarningLine />} color="text-emerald-600" bg="bg-emerald-50" />
//       </div>

//       {/* 3. Main Transaction Table */}
//       <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
//           <h3 className="font-bold text-slate-800">Inflow Ledger</h3>
//           <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">Live Updates</span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
//               <tr>
//                 <th className="px-6 py-4">Patient / Time</th>
//                 <th className="px-6 py-4">Service Description</th>
//                 <th className="px-6 py-4">Dept</th>
//                 <th className="px-6 py-4">Amount</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {TRANSACTIONS.map((tx) => (
//                 <tr key={tx.id} className="hover:bg-blue-50/20 transition-colors group">
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-700 text-sm">{tx.patient}</span>
//                       <span className="text-[10px] text-gray-400 font-medium">{tx.time}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600 font-medium">{tx.service}</td>
//                   <td className="px-6 py-4">
//                     <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase">{tx.dept}</span>
//                   </td>
//                   <td className="px-6 py-4 font-black text-slate-800 text-sm">₦{tx.cost.toLocaleString()}</td>
//                   <td className="px-6 py-4">
//                     <StatusBadge status={tx.status} />
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button
//                       onClick={() => handleOpenModal(tx)}
//                       className="p-2 text-gray-400 hover:text-[#6777ef] hover:bg-blue-50 rounded-xl transition-all"
//                     >
//                       <RiEyeLine size={20} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 4. The Finance Modal */}
//       <AnimatePresence>
//         {isModalOpen && selectedTx && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={handleCloseModal}
//               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
//             />
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
//             >
//               {/* Modal Header */}
//               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-white shadow-sm border border-gray-100 text-[#6777ef] rounded-2xl">
//                     <RiFileTextLine size={28} />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-black text-slate-800 tracking-tight">Transaction Detail</h2>
//                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedTx.id}</p>
//                   </div>
//                 </div>
//                 <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
//                   <RiCloseLine size={24} />
//                 </button>
//               </div>

//               {/* Modal Content */}
//               <div className="p-8">
//                 <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-dashed border-gray-200">
//                   <div>
//                     <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Patient</p>
//                     <p className="font-bold text-slate-800">{selectedTx.patient}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Payment Mode</p>
//                     <p className="font-bold text-slate-800">{selectedTx.paymentMethod}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4 mb-8">
//                   <div className="flex justify-between items-center text-sm font-medium text-gray-500">
//                     <span>{selectedTx.service}</span>
//                     <span className="font-bold text-slate-800">₦{selectedTx.cost.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                     <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total Payable</span>
//                     <span className="text-2xl font-black text-[#6777ef]">₦{selectedTx.cost.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 <div className={`flex items-center gap-4 p-5 rounded-3xl ${selectedTx.status === 'cleared' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
//                    {selectedTx.status === 'cleared' ? <RiCheckDoubleLine size={24} className="text-emerald-600" /> : <RiBankCardLine size={24} className="text-amber-600 animate-pulse" />}
//                    <div>
//                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</p>
//                      <p className={`font-black uppercase text-sm ${selectedTx.status === 'cleared' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedTx.status}</p>
//                    </div>
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
//                 <button className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
//                   <RiPrinterLine size={18} /> Print
//                 </button>
//                 {selectedTx.status !== 'cleared' && (
//                   <button className="flex-1 py-4 bg-[#6777ef] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all">
//                     Confirm & Clear
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // --- Sub-Components ---
// const StatCard = ({ label, value, icon, color, bg }) => (
//   <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
//     <div className={`p-4 rounded-2xl ${bg} ${color}`}>{React.cloneElement(icon, { size: 24 })}</div>
//     <div>
//       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
//       <h3 className="text-xl font-black text-slate-800">{value}</h3>
//     </div>
//   </div>
// );

// const StatusBadge = ({ status }) => {
//   const isCleared = status === "cleared";
//   return (
//     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit font-black text-[10px] uppercase tracking-wider ${isCleared ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${isCleared ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
//       {status}
//     </div>
//   );
// };

// export default FinanceAdmin;
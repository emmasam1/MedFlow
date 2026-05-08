import React, { useState } from "react";
import {
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineTrendingDown,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { Tag, Tooltip, Progress, Segmented } from "antd";
import CustomTable from "../../components/CustomTable";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import { useStore } from "../../store/store";
import { format, differenceInDays } from "date-fns";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { motion } from "framer-motion";

const MOCK_EXPIRY_DATA = [
  {
    id: "EXP-881",
    name: "Amoxicillin 500mg",
    batch: "B-2024-X",
    category: "Antibiotics",
    expiryDate: "2026-05-10",
    stock: 150,
    unitCost: 3.5,
  },
  {
    id: "EXP-229",
    name: "Surgical Spirit",
    batch: "SS-992",
    category: "Supplies",
    expiryDate: "2026-06-15",
    stock: 40,
    unitCost: 12.0,
  },
  {
    id: "EXP-441",
    name: "Paracetamol Syrup",
    batch: "PARA-01",
    category: "Pediatrics",
    expiryDate: "2026-04-01",
    stock: 12,
    unitCost: 5.0,
  },
  {
    id: "EXP-005",
    name: "Insulin Vials",
    batch: "INS-77",
    category: "Cold Chain",
    expiryDate: "2026-05-28",
    stock: 5,
    unitCost: 100.0,
  },
  {
    id: "EXP-990",
    name: "Latex Gloves (L)",
    batch: "GLV-22",
    category: "Surgicals",
    expiryDate: "2027-12-20",
    stock: 500,
    unitCost: 0.5,
  },
];

const ExpiryTracker = () => {
  const { darkMode } = useStore();
  const [data, setData] = useState(MOCK_EXPIRY_DATA);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("All");
  const user = useAppStore((state) => state.user);
  const [isSyncing, setIsSyncing] = useState(false);
  const [disposalLog, setDisposalLog] = useState([]);

  // Logic to determine Risk Level based on dates
  const calculateRisk = (expiryDate) => {
    const daysLeft = differenceInDays(new Date(expiryDate), new Date());
    if (daysLeft < 0)
      return {
        label: "EXPIRED",
        color: "red",
        severity: 100,
        status: "exception",
        bg: "bg-red-50 text-red-600",
      };
    if (daysLeft <= 30)
      return {
        label: "CRITICAL",
        color: "orange",
        severity: 85,
        status: "active",
        bg: "bg-orange-50 text-orange-600",
      };
    if (daysLeft <= 90)
      return {
        label: "WARNING",
        color: "blue",
        severity: 50,
        status: "normal",
        bg: "bg-blue-50 text-blue-600",
      };
    return {
      label: "STABLE",
      color: "green",
      severity: 15,
      status: "normal",
      bg: "bg-green-50 text-green-600",
    };
  };

  const stats = [
    {
      title: "Expired Items",
      value: data.filter(
        (i) => differenceInDays(new Date(i.expiryDate), new Date()) < 0,
      ).length,
      icon: <HiOutlineTrash />,
      color: "red",
    },
    {
      title: "Expiring < 30 Days",
      value: data.filter((i) => {
        const d = differenceInDays(new Date(i.expiryDate), new Date());
        return d >= 0 && d <= 30;
      }).length,
      icon: <HiOutlineExclamation />,
      color: "orange",
    },
    {
      title: "Potential Loss",
      value: `$${data
        .reduce((acc, curr) => {
          const d = differenceInDays(new Date(curr.expiryDate), new Date());
          return d <= 30 ? acc + curr.stock * curr.unitCost : acc;
        }, 0)
        .toLocaleString()}`,
      icon: <HiOutlineTrendingDown />,
      color: "blue",
    },
  ];

  const columns = [
    {
      title: "Inventory Item",
      key: "name",
      render: (text, r) => (
        <div className="flex flex-col">
          <span className="font-bold text-black">{text}</span>
          <span className="text-[10px] font-mono text-black uppercase">
            BATCH: {r.batch} • {r.category}
          </span>
        </div>
      ),
    },
    {
      title: "Shelf Life Remaining",
      key: "expiryDate",
      render: (date) => {
        const risk = calculateRisk(date);
        const daysLeft = differenceInDays(new Date(date), new Date());
        return (
          <div className="w-40">
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-[10px] font-black uppercase ${risk.color === "red" ? "text-red-500" : "text-slate-400"}`}
              >
                {daysLeft < 0 ? "Outdated" : `${daysLeft} Days Left`}
              </span>
              <span className="text-[9px] font-bold opacity-50">
                {risk.severity}%
              </span>
            </div>
            <Progress
              percent={risk.severity}
              size="small"
              showInfo={false}
              strokeColor={
                risk.color === "red"
                  ? "#ef4444"
                  : risk.color === "orange"
                    ? "#f97316"
                    : "#3b82f6"
              }
              trailColor={darkMode ? "#1e293b" : "#f1f5f9"}
            />
          </div>
        );
      },
    },
    {
      title: "Expiry Date",
      key: "expiryDate",
      render: (date) => (
        <div
          className={`px-3 py-1 rounded-lg font-mono text-xs font-bold inline-flex items-center gap-2 ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
        >
          <HiOutlineCalendar /> {format(new Date(date), "dd MMM yyyy")}
        </div>
      ),
    },
    {
      title: "Risk Level",
      key: "expiryDate",
      render: (date) => {
        const risk = calculateRisk(date);
        return (
          <Tag
            color={risk.color}
            className="font-black border-none px-3 rounded-full uppercase text-[10px]"
          >
            {risk.label}
          </Tag>
        );
      },
    },
  ];

  const handleSyncStock = () => {
    setIsSyncing(true);
    const toastId = toast.loading("Fetching latest stock records...");

    setTimeout(() => {
      setData([...MOCK_EXPIRY_DATA]); // Simulates a fresh fetch
      setIsSyncing(false);
      toast.success("Stock inventory synchronized", { id: toastId });
    }, 1200);
  };

  const handleConfirmDisposal = (item) => {
    const entry = {
      ...item,
      disposedAt: new Date().toISOString(),
      handler: `${user?.firstName} ${user?.lastName || ""}`,
    };

    setDisposalLog((prev) => [entry, ...prev]);
    setData((prev) => prev.filter((i) => i.id !== item.id));
    setSelectedItem(null);
    toast.error(`${item.name} moved to Disposal Log`, { icon: "🗑️" });
  };

  const buttonMotion = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1
            className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Expiry Control
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring shelf-life and preventing medical waste.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button {...buttonMotion} className={buttonStyle} onClick={handleSyncStock}>
            <HiOutlineRefresh className={`text-blue-500 ${isSyncing ? "animate-spin" : ""}`}/> {isSyncing ? "SYNCING..." : "SYNC STOCK"}
          </motion.button>
          
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all border-none cursor-pointer text-xs uppercase tracking-widest relative">
            <HiOutlineTrash /> Disposal Log
            {disposalLog.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                {disposalLog.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Table Section */}
      <CustomTable
        title="Inventory Expiration Audit"
        columns={columns}
        data={data}
        searchableKeys={["name", "batch", "category"]}
        actions={
          user?.role === "store_officer"
            ? (row) => (
                <Tooltip title="Manage Item">
                  <button
                    onClick={() => setSelectedItem(row)}
                    className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <HiOutlineClock size={20} />
                  </button>
                </Tooltip>
              )
            : undefined
        }
      />

      {/* Management Modal */}
      <Modal title="" isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div
     
          >
            {/* Dynamic Header based on risk */}
            <div
              className={`${calculateRisk(selectedItem.expiryDate).color === "red" ? "bg-red-600" : "bg-orange-500"} p-8 text-white relative -mb-3`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <HiOutlineShieldCheck />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Quality Control Protocol
                  </span>
                </div>
                <h2 className="text-3xl font-black m-0 tracking-tight">
                  {selectedItem.name}
                </h2>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs font-bold opacity-70">
                    BATCH: {selectedItem.batch}
                  </span>
                  <span className="text-xs font-bold opacity-70">
                    DEPT: {selectedItem.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Expiration Date
                  </p>
                  <p className="font-black text-slate-800 m-0">
                    {format(new Date(selectedItem.expiryDate), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="p-4 bg-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Stock Value
                  </p>
                  <p className="font-black text-blue-600 m-0">
                    $
                    {(
                      selectedItem.stock * selectedItem.unitCost
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Protocol Intervention
                </p>

                {differenceInDays(
                  new Date(selectedItem.expiryDate),
                  new Date(),
                ) < 0 ? (
                  <button
                    onClick={() => {
                      toast.error("Item moved to Disposal Bin");
                      setSelectedItem(null);
                    }}
                    className="w-full py-4 bg-red-600 text-white font-black border-none cursor-pointer hover:bg-red-700 flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 transition-all"
                  >
                    <HiOutlineTrash size={20} /> CONFIRM DESTRUCTION / DISPOSAL
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        toast.success("Redistribution request sent");
                        setSelectedItem(null);
                      }}
                      className="w-full py-4 bg-blue-600 text-white font-black border-none cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                    >
                      <HiOutlineRefresh size={20} /> PRIORITIZE / REDISTRIBUTE
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black border-none cursor-pointer hover:bg-slate-200"
                    >
                      LOG AS CHECKED
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExpiryTracker;

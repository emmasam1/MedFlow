import React, { useState } from "react";
import { 
  HiOutlineClipboardList, 
  HiOutlineUser, 
  HiOutlinePrinter,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineEye
} from "react-icons/hi";
import { Tag, Tooltip, Avatar } from "antd";
import CustomTable from "../../components/CustomTable";
import StatCard from "../../components/StatCard";
import { useStore } from "../../store/store";
import { format } from "date-fns";

const MOCK_DISPENSE_LOG = [
  { 
    id: "LOG-9921", 
    patientName: "John Doe", 
    patientId: "PID-552", 
    drugName: "Amoxicillin 500mg", 
    quantity: "15 Tablets", 
    dosage: "1x3 Daily", 
    dispensedBy: "Pharm. Sarah K.", 
    timestamp: "2026-05-07T10:30:00",
    status: "Completed"
  },
  { 
    id: "LOG-9922", 
    patientName: "Mary Jane", 
    patientId: "PID-108", 
    drugName: "Paracetamol Syrup", 
    quantity: "1 Bottle", 
    dosage: "10ml SOS", 
    dispensedBy: "Pharm. Sarah K.", 
    timestamp: "2026-05-07T11:15:00",
    status: "Completed"
  },
  { 
    id: "LOG-9923", 
    patientName: "Michael Smith", 
    patientId: "PID-331", 
    drugName: "Insulin Vials", 
    quantity: "2 Vials", 
    dosage: "5 units SC Daily", 
    dispensedBy: "Pharm. Alex Chen", 
    timestamp: "2026-05-07T12:05:00",
    status: "Completed"
  },
];

const DispenseLog = () => {
  const { darkMode } = useStore();
  const [data] = useState(MOCK_DISPENSE_LOG);

  const stats = [
    { 
      title: "Total Dispensed (Today)", 
      value: data.length, 
      icon: <HiOutlineClipboardList />, 
      color: "blue" 
    },
    { 
      title: "Patients Served", 
      value: new Set(data.map(i => i.patientId)).size, 
      icon: <HiOutlineUser />, 
      color: "green" 
    },
    { 
      title: "High-Priority Meds", 
      value: "4", 
      icon: <HiOutlineFilter />, 
      color: "orange" 
    },
  ];

  const columns = [
    { 
      title: "Patient Details", 
      key: "patientName", 
      render: (name, r) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-blue-100 text-blue-600 font-bold">
            {name.charAt(0)}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-white">{name}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
              {r.patientId}
            </span>
          </div>
        </div>
      ) 
    },
    { 
      title: "Medication & Dosage", 
      key: "drugName", 
      render: (drug, r) => (
        <div className="flex flex-col">
          <span className="font-bold text-blue-600">{drug}</span>
          <span className="text-[11px] text-slate-500 italic">
            Qty: {r.quantity} • {r.dosage}
          </span>
        </div>
      )
    },
    { 
      title: "Dispensed By", 
      key: "dispensedBy", 
      render: (staff) => (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{staff}</span>
        </div>
      )
    },
    { 
      title: "Timestamp", 
      key: "timestamp", 
      render: (time) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {format(new Date(time), "hh:mm a")}
          </span>
          <span className="text-[10px] text-slate-400">
            {format(new Date(time), "dd MMM yyyy")}
          </span>
        </div>
      )
    },
    { 
      title: "Status", 
      key: "status", 
      render: (status) => (
        <Tag color="green" className="font-black border-none px-3 rounded-full uppercase text-[10px]">
          {status}
        </Tag>
      )
    }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Dispense Log
          </h1>
          <p className="text-slate-500 font-medium">Official record of pharmaceutical distribution.</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer shadow-sm text-xs">
                <HiOutlineDownload className="text-blue-500" /> EXPORT PDF
            </button>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all border-none cursor-pointer text-xs uppercase tracking-widest">
                <HiOutlinePrinter /> Print Daily Report
            </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Log Table */}
      <CustomTable
        title="Distribution Audit Trail"
        columns={columns}
        data={data}
        searchableKeys={["patientName", "drugName", "patientId"]}
        actions={(row) => (
          <Tooltip title="View Prescription Details">
            <button 
              className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => alert(`Details for ${row.id}`)}
            >
              <HiOutlineEye size={20} />
            </button>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default DispenseLog;
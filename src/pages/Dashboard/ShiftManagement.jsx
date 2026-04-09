import React, { useState } from "react";
import { RiUserSharedLine, RiAddLine, RiFilter2Line, RiMore2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const ShiftManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("Today");

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shift Coordination</h2>
          <p className="text-sm text-slate-500 mt-1">Manage hospital duty rosters and rotations</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors"
        >
          <RiAddLine size={20} /> Assign Shift
        </motion.button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Morning Shift", val: "12 Staff", color: "bg-blue-50 text-blue-600" },
          { label: "Night Shift", val: "8 Staff", color: "bg-purple-50 text-purple-600" },
          { label: "Pending Swaps", val: "3 Request", color: "bg-amber-50 text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border border-white shadow-sm ${stat.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</p>
            <p className="text-2xl font-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Filters */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Today', 'This Week'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-2 text-slate-500 font-semibold text-sm border px-4 py-2 rounded-xl hover:bg-slate-50">
                <RiFilter2Line /> Filter by Ward
            </button>
        </div>

        {/* Standard HTML Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timing</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_SHIFTS.map((shift) => (
                <motion.tr 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  key={shift.id} 
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
                        {shift.staffName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{shift.staffName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      shift.type === 'Night' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {shift.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-bold text-slate-700">{shift.startTime} - {shift.endTime}</div>
                      <div className="text-xs text-slate-400">{shift.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${shift.status === 'On-going' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-sm font-medium text-slate-600">{shift.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                      <RiUserSharedLine size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 relative shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-800 mb-6">Assign New Duty</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Staff Member</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-700 focus:ring-2 ring-blue-500 outline-none">
                    <option>Select staff member...</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start</label>
                      <input type="time" className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 ring-blue-500" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">End</label>
                      <input type="time" className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 ring-blue-500" />
                   </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 shadow-lg shadow-blue-100">
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MOCK_SHIFTS = [
  { id: 1, staffName: "Dr. Sarah Johnson", type: "Morning", startTime: "08:00", endTime: "16:00", date: "2024-04-10", status: "On-going" },
  { id: 2, staffName: "Nurse Janet Okon", type: "Night", startTime: "20:00", endTime: "04:00", date: "2024-04-10", status: "Upcoming" },
  { id: 3, staffName: "Dr. Mike Ross", type: "Morning", startTime: "08:00", endTime: "16:00", date: "2024-04-10", status: "Upcoming" },
];

export default ShiftManager;
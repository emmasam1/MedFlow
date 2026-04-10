import React, { useState, useEffect } from "react";
import { 
  RiMoonClearLine, RiSunFoggyLine, RiTimerFlashLine, 
  RiExchangeLine, RiCheckDoubleLine, RiCloseCircleLine,
  RiFilter2Line, RiSearch2Line, RiUserHeartLine
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import StatCard from "../../components/StatCard";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getStaff } = useAppStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadRoster = async () => {
      setIsLoading(true);
      const res = await getStaff();
      // Map staff to a 'shift' structure for the UI
      const roster = (res?.staffMembers || []).map(staff => ({
        ...staff,
        shiftType: Math.random() > 0.5 ? "Day" : "Night", // Mocking shift logic
        startTime: "08:00 AM",
        endTime: "04:00 PM",
        status: staff.isActive ? "On-Duty" : "Off-Duty"
      }));
      setShifts(roster);
      setIsLoading(false);
    };
    loadRoster();
  }, [getStaff]);

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 font-sans">
      
      {/* --- SHIFT HEADERS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <RiTimerFlashLine className="text-blue-600" />
            Shift Roster
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time clinical coverage and rotation management</p>
        </div>

        <div className="flex gap-3">
          <motion.button 
            whileHover={{ y: -2 }}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 shadow-sm flex items-center gap-2"
          >
            <RiExchangeLine /> Swap Shift
          </motion.button>
          <motion.button 
            whileHover={{ y: -2 }}
            className="bg-slate-900 px-6 py-3 rounded-2xl font-bold text-white shadow-xl flex items-center gap-2"
          >
            + Assign Rotation
          </motion.button>
        </div>
      </div>

      {/* --- COVERAGE OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Morning Coverage" value="14 Staff" color="orange" icon={<RiSunFoggyLine />} />
        <StatCard title="Night Coverage" value="09 Staff" color="indigo" icon={<RiMoonClearLine />} />
        <StatCard title="Critical Gaps" value="02 Units" color="red" icon={<RiUserHeartLine />} />
      </div>

      {/* --- THE ROSTER BOARD --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2">
            {["all", "Morning", "Night", "On-Call"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  filter === type ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative group">
            <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Filter by Unit..." 
              className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Shift Grid */}
        <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {shifts.map((staff, idx) => (
              <motion.div
                key={staff._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative flex items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer"
              >
                {/* Visual Shift Indicator */}
                <div className={`absolute top-6 left-6 w-1 h-12 rounded-full ${staff.shiftType === 'Day' ? 'bg-amber-400' : 'bg-indigo-600'}`} />
                
                <div className="flex items-center gap-6 pl-4">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                    {staff.avatar ? <img src={staff.avatar} className="object-cover h-full w-full" /> : <span className="font-black text-slate-300">{staff.firstName[0]}</span>}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-black text-slate-800 leading-tight">
                      {staff.firstName} {staff.lastName}
                    </h4>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">
                      {staff.department} • {staff.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Schedule</p>
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      {staff.shiftType === "Day" ? <RiSunFoggyLine className="text-amber-500" /> : <RiMoonClearLine className="text-indigo-500" />}
                      <span>{staff.shiftType === "Day" ? "08:00 - 16:00" : "20:00 - 04:00"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-colors">
                      <RiCheckDoubleLine size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;
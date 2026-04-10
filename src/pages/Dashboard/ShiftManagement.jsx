import React, { useState, useEffect } from "react";
import { 
  RiMoonClearLine, RiSunFoggyLine, RiTimerFlashLine, 
  RiExchangeLine, RiCheckDoubleLine, RiCloseCircleLine,
  RiFilter2Line, RiSearch2Line, RiUserHeartLine, RiStethoscopeLine,
  RiTimeLine, RiBuilding4Line, RiDragMove2Line, RiAlertFill
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const { getStaff } = useAppStore();

  // Form State for new Rotation
  const [newRotation, setNewRotation] = useState({
    staffId: "",
    department: "Emergency",
    shiftType: "Day",
    startTime: "08:00",
    endTime: "16:00"
  });

  useEffect(() => {
    loadRoster();
  }, [getStaff]);

  const loadRoster = async () => {
    setIsLoading(true);
    try {
      const res = await getStaff();
      const roster = (res?.staffMembers || []).map(staff => ({
        ...staff,
        shiftType: Math.random() > 0.5 ? "Day" : "Night",
        startTime: "08:00",
        endTime: "16:00",
        hasConflict: false
      }));
      setShifts(roster);
    } catch (err) {
      toast.error("Failed to sync roster");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CONFLICT DETECTOR LOGIC ---
  const checkConflicts = (rotation) => {
    // Check if professional is already working in that time frame
    const personShifts = shifts.filter(s => s._id === rotation.staffId);
    for (const existing of personShifts) {
      const isOverlapping = rotation.startTime < existing.endTime && rotation.endTime > existing.startTime;
      if (isOverlapping) {
        return { type: "CONFLICT", message: "Schedule Overlap: Staff already assigned elsewhere." };
      }
    }
    // Capacity Check
    const deptCount = shifts.filter(s => s.department === rotation.department).length;
    if (deptCount >= 8) {
      return { type: "WARNING", message: `${rotation.department} is at peak capacity.` };
    }
    return null;
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (index) => setDraggedItemIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (targetIndex) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const updated = [...shifts];
    const draggedData = { ...updated[draggedItemIndex] };
    const targetData = { ...updated[targetIndex] };

    // Swap shift details only
    updated[draggedItemIndex].shiftType = targetData.shiftType;
    updated[draggedItemIndex].startTime = targetData.startTime;
    updated[draggedItemIndex].endTime = targetData.endTime;

    updated[targetIndex].shiftType = draggedData.shiftType;
    updated[targetIndex].startTime = draggedData.startTime;
    updated[targetIndex].endTime = draggedData.endTime;

    setShifts(updated);
    setDraggedItemIndex(null);
    toast.info("Shift rotation swapped successfully");
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const issue = checkConflicts(newRotation);
    if (issue?.type === "CONFLICT") return toast.error(issue.message);
    if (issue?.type === "WARNING") toast.warning(issue.message);
    
    // Logic to update state/backend would go here
    setIsModalOpen(false);
    toast.success("Rotation Assigned");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 font-sans min-h-screen">
      <ToastContainer position="top-right" />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <RiTimerFlashLine className="text-blue-600 animate-pulse" />
            Shift Roster
          </h1>
          <p className="text-slate-500 font-medium mt-1">Institutional Rotation Management — Teaching Hospital</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 px-8 py-4 rounded-2xl font-bold text-white shadow-xl flex items-center gap-3 hover:bg-blue-600 hover:-translate-y-1 transition-all"
        >
          <RiStethoscopeLine size={20} />
          Assign Rotation
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Morning Shift" value="14 Staff" color="orange" icon={<RiSunFoggyLine />} />
        <StatCard title="Night Shift" value="09 Staff" color="indigo" icon={<RiMoonClearLine />} />
        <StatCard title="Duty Conflicts" value="0" color="red" icon={<RiAlertFill />} />
      </div>

      {/* ROSTER TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Live Rotation Board</h3>
          </div>
          <div className="relative group">
            <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" placeholder="Search roster..." className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none w-72 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-2">Medical Professional</th>
                <th className="px-6 py-2">Unit</th>
                <th className="px-6 py-2">Rotation Time</th>
                <th className="px-6 py-2 text-center">Status</th>
                <th className="px-6 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shifts.map((staff, idx) => (
                  <motion.tr 
                    key={staff._id}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    className={`group bg-white hover:bg-slate-50 transition-all cursor-grab active:cursor-grabbing border border-slate-50 rounded-2xl shadow-sm ${draggedItemIndex === idx ? 'opacity-30' : ''}`}
                  >
                    <td className="px-6 py-5 rounded-l-2xl">
                      <div className="flex items-center gap-4">
                        <RiDragMove2Line className="text-slate-200 group-hover:text-blue-400 transition-colors" />
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400">
                          {staff.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 tracking-tight">{staff.firstName} {staff.lastName}</p>
                          <p className="text-[10px] uppercase font-black text-blue-500">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                        <RiBuilding4Line className="text-slate-300" /> {staff.department}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {staff.shiftType === "Day" ? <RiSunFoggyLine className="text-amber-500" /> : <RiMoonClearLine className="text-indigo-500" />}
                        <span className="text-sm font-bold text-slate-700">{staff.startTime} - {staff.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${staff.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {staff.isActive ? "On-Duty" : "Standby"}
                      </span>
                    </td>
                    <td className="px-6 py-5 rounded-r-2xl text-right">
                      <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><RiExchangeLine size={18}/></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN ROTATION MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Rotation Assignment">
        <form onSubmit={handleAssignSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Select Professional</label>
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100"
                onChange={(e) => setNewRotation({...newRotation, staffId: e.target.value})}
              >
                <option value="">Choose Staff...</option>
                {shifts.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block flex items-center gap-1 tracking-widest">
                  <RiBuilding4Line /> Department
                </label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100"
                  onChange={(e) => setNewRotation({...newRotation, department: e.target.value})}
                >
                  <option>Emergency</option>
                  <option>Cardiology</option>
                  <option>Surgery</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Shift Window</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl">
                  <button type="button" onClick={() => setNewRotation({...newRotation, shiftType: 'Day'})} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase transition-all ${newRotation.shiftType === 'Day' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Day</button>
                  <button type="button" onClick={() => setNewRotation({...newRotation, shiftType: 'Night'})} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase transition-all ${newRotation.shiftType === 'Night' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Night</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Start Time</label>
                <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" onChange={(e) => setNewRotation({...newRotation, startTime: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">End Time</label>
                <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" onChange={(e) => setNewRotation({...newRotation, endTime: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
            <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Confirm Roster</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShiftManagement;
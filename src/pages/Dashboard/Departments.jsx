import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal";
import {
  RiStackLine,
  RiUserHeartLine,
  RiTempHotLine,
  RiMicroscopeLine,
  RiPulseLine,
  RiMore2Fill,
  RiGroupLine,
  RiHotelBedLine,
  RiAddLine,
  RiArrowLeftLine,
  RiDashboardLine,
  RiShieldCheckLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";

const Departments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  /* ---------------- Styles ---------------- */
  const buttonMotion = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  const [departments] = useState([
    { id: 1, name: "Emergency Unit", hod: "Dr. Sarah Jenkins", staffCount: 24, occupancy: 85, status: "Critical", color: "red", icon: <RiTempHotLine size={20} /> },
    { id: 2, name: "Cardiology", hod: "Dr. Marcus Chen", staffCount: 12, occupancy: 60, status: "Stable", color: "blue", icon: <RiPulseLine size={20} /> },
    { id: 3, name: "Diagnostic Lab", hod: "Dr. Elena Rodriguez", staffCount: 8, occupancy: 40, status: "Stable", color: "emerald", icon: <RiMicroscopeLine size={20} /> },
    { id: 4, name: "Pediatrics", hod: "Dr. James Wilson", staffCount: 15, occupancy: 95, status: "Full", color: "purple", icon: <RiUserHeartLine size={20} /> },
  ]);

  const getColorClasses = (color) => {
    const maps = {
      red: "text-red-600 bg-red-50",
      blue: "text-blue-600 bg-blue-50",
      emerald: "text-emerald-600 bg-emerald-50",
      purple: "text-purple-600 bg-purple-50",
    };
    return maps[color] || maps.blue;
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {!selectedDept ? (
          /* ---------------- MAIN GRID VIEW ---------------- */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Hospital Departments</h2>
                <p className="text-sm text-slate-500">Manage units and staff allocation.</p>
              </div>
              <motion.button {...buttonMotion} onClick={() => setIsOpen(true)} className={buttonStyle}>
                <RiAddLine size={18} /> Add Department
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <motion.div
                  key={dept.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(dept.color)}`}>
                      {dept.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      dept.status === "Critical" ? "bg-red-100 text-red-600" : 
                      dept.status === "Full" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                    }`}>
                      {dept.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-md font-bold text-slate-800 truncate">{dept.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate">HOD: {dept.hod}</p>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-slate-50 mb-3">
                    <div className="flex items-center gap-1.5">
                      <RiGroupLine className="text-slate-400" size={14} />
                      <span className="text-xs font-bold text-slate-700">{dept.staffCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RiHotelBedLine className="text-slate-400" size={14} />
                      <span className="text-xs font-bold text-slate-700">{dept.occupancy}%</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedDept(dept)}
                    className="w-full py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-500 text-[11px] font-bold rounded-lg transition-all"
                  >
                    View Unit Details
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ---------------- ADMIN DETAILED VIEW ---------------- */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Back Header */}
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
              <button 
                onClick={() => setSelectedDept(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <RiArrowLeftLine size={24} />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedDept.name} Dashboard</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Unit Command Center</p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <RiGroupLine className="text-blue-600 mb-2" size={24} />
                    <p className="text-xs text-blue-400 font-bold uppercase">On-Duty Staff</p>
                    <p className="text-2xl font-black text-blue-900">{selectedDept.staffCount}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <RiHotelBedLine className="text-purple-600 mb-2" size={24} />
                    <p className="text-xs text-purple-400 font-bold uppercase">Bed Load</p>
                    <p className="text-2xl font-black text-purple-900">{selectedDept.occupancy}%</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <RiMoneyDollarCircleLine className="text-emerald-600 mb-2" size={24} />
                    <p className="text-xs text-emerald-400 font-bold uppercase">Daily Rev</p>
                    <p className="text-2xl font-black text-emerald-900">$12,400</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl min-h-[200px] flex items-center justify-center border border-dashed border-slate-200 text-slate-400 italic">
                  [ Render Department-Specific Staff Table / Patient List Here ]
                </div>
              </div>

              {/* Right Column: Actions & Details */}
              <div className="space-y-4">
                <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-xl">
                  <h4 className="font-bold mb-1 italic">Unit HOD</h4>
                  <p className="text-lg font-black text-blue-400">{selectedDept.hod}</p>
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Location</span>
                      <span className="font-medium text-slate-200">North Wing, Floor 3</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Extension</span>
                      <span className="font-medium text-slate-200">#402</span>
                    </div>
                  </div>
                </div>
                <button className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition-all flex items-center justify-center gap-2">
                   Manage Shift Roster
                </button>
                <button className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition-all flex items-center justify-center gap-2">
                   Equipment Health
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Department"
      >
        <form className="p-1">
          <div className="space-y-8">
            {/* SECTION 1: IDENTITY */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology Unit"
                    className="px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Dept Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CARD-01"
                    className="px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: MANAGEMENT & CAPACITY */}
            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">
                Management & Logistics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Head of Dept (HOD)
                  </label>
                  <select className="px-3 py-2 border rounded-lg border-gray-300 cursor-pointer">
                    <option value="">Select a Doctor</option>
                    <option value="1">Dr. Sarah Jenkins</option>
                    <option value="2">Dr. Marcus Chen</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Contact Extension
                  </label>
                  <input
                    type="text"
                    placeholder="Internal Phone Number"
                    className="px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Total Bed Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="Max Patients"
                    className="px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Location / Wing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. North Wing, 2nd Floor"
                    className="px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
              <div className="md:col-span-2 mt-4">
            <button
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
              {isSubmitting ? "Creating..." : " Create Department"}
            </button>
          </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
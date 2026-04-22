import React, { useState, useEffect } from "react";
import {
    RiMoonClearLine,
    RiSunFoggyLine,
    RiTimerFlashLine,
    RiExchangeLine,
    RiCheckDoubleLine,
    RiCloseCircleLine,
    RiSearch2Line,
    RiStethoscopeLine,
    RiBuilding4Line,
    RiDragMove2Line,
    RiAlertFill,
    RiChatHistoryLine,
    RiShieldFlashLine,
    RiUserAddLine,
    RiAlarmWarningLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";

// --- SUB-COMPONENT: CLINICAL HANDOVER DRAWER ---
const HandoverDrawer = ({ isOpen, onClose, staff, onSave }) => {
    if (!staff) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-2xl z-[70] p-8 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    Shift Handover
                                </h2>
                                <p className="text-sm text-slate-500 font-medium font-mono uppercase">
                                    Rotation: {staff.firstName} {staff.lastName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"
                            >
                                <RiCloseCircleLine size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                <p className="text-[10px] font-black uppercase text-blue-600 mb-1">
                                    Standard Protocol (SBAR)
                                </p>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Notes entered here are logged into the clinical audit trail
                                    and cannot be edited after sealing.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {[
                                    "Situation",
                                    "Background",
                                    "Assessment",
                                    "Recommendation",
                                ].map((field) => (
                                    <div key={field}>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                            {field}
                                        </label>
                                        <textarea
                                            placeholder={`Describe the ${field.toLowerCase()}...`}
                                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 min-h-[100px] outline-none transition-all resize-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                onClick={() => onSave(staff._id)}
                            >
                                <RiCheckDoubleLine /> Seal & Finalize Handover
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};



// --- MAIN COMPONENT ---
const ShiftManagement = () => {
    const { getStaff, authUser } = useAppStore();

    // 1. Permissions & Identity
    // Note: In production, authUser.role comes from your JWT/Store
    const isAdmin = authUser?.role === "admin" || true; // Set to true for dev testing

    // 2. State Management
    const [shifts, setShifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isHandoverOpen, setIsHandoverOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("roster");

    const [newRotation, setNewRotation] = useState({
        staffId: "",
        department: "Emergency",
        shiftType: "Day",
        startTime: "08:00",
        endTime: "16:00",
    });

    useEffect(() => {
        loadRoster();
    }, [getStaff]);

    const loadRoster = async () => {
        setIsLoading(true);
        try {
            const res = await getStaff();
            const roster = (res?.staffMembers || []).map((staff) => ({
                ...staff,
                shiftType: Math.random() > 0.5 ? "Day" : "Night",
                startTime: "08:00",
                endTime: "16:00",
                hasUnreadNote: Math.random() > 0.8,
            }));
            setShifts(roster);
        } catch (err) {
            toast.error("Roster synchronization failed");
        } finally {
            setIsLoading(false);
        }
    };

    // --- HANDLERS: ASSIGNMENT ---
    const handleAssignSubmit = (e) => {
        e.preventDefault();
        if (!newRotation.staffId)
            return toast.error("Please select a professional");

        // Mock success logic
        toast.success("New rotation successfully deployed to roster");
        setIsAssignModalOpen(false);
    };

    const handleHandoverSave = (id) => {
        toast.success("Clinical handover archived and synced.");
        setIsHandoverOpen(false);
    };

    // Filtered Shifts for Search
    const filteredShifts = shifts.filter((s) =>
        `${s.firstName} ${s.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    );

    // --- TOGGLE ON-CALL HANDLER ---
    const toggleOnCallStatus = (id) => {
        setShifts((prevShifts) =>
            prevShifts.map((staff) =>
                staff._id === id ? { ...staff, isOnCall: !staff.isOnCall } : staff,
            ),
        );

        // Optional: Add a toast notification for feedback
        const targetStaff = shifts.find((s) => s._id === id);
        if (!targetStaff?.isOnCall) {
            toast.success(`${targetStaff?.lastName} is now ON-CALL (Standby)`, {
                icon: "🟢",
            });
        } else {
            toast.info(`${targetStaff?.lastName} returned to Active Duty`);
        }
    };

    // --- DELETE HANDLER ---
    const handleDeleteShift = (id) => {
        if (
            window.confirm(
                "Are you sure you want to remove this professional from the active roster?",
            )
        ) {
            setShifts((prev) => prev.filter((staff) => staff._id !== id));
            toast.error("Rotation entry deleted");
        }
    };

    // --- EDIT HANDLER ---
    const handleEditShift = (staff) => {
        setSelectedStaff(staff);
        setNewRotation({
            staffId: staff._id,
            department: staff.department,
            shiftType: staff.shiftType,
            startTime: staff.startTime,
            endTime: staff.endTime,
        });
        setIsAssignModalOpen(true);
    };

    // -------TABS-------
    const tabs = [
        { id: "roster", label: "Live Roster", icon: <RiTimerFlashLine /> },
        { id: "onCall", label: "On Call", icon: <RiAlarmWarningLine /> },
        { id: "Logs", label: "HandOver Logs", icon: <RiChatHistoryLine /> },
    ];


    const buttonMotion = {
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring", stiffness: 300 },
    };
    const buttonStyle =
        "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";


    return (
        <div className="max-w-[1600px] mx-auto px-4 min-h-screen bg-slate-50/30">
            <ToastContainer position="bottom-right" theme="dark" />

            <HandoverDrawer
                isOpen={isHandoverOpen}
                onClose={() => setIsHandoverOpen(false)}
                staff={selectedStaff}
                onSave={handleHandoverSave}
            />

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {isAdmin && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                                <RiShieldFlashLine /> Full System Control
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <RiTimerFlashLine className="text-blue-600 animate-pulse" />
                        Shift Control Center
                    </h1>
                    <p className="text-sm text-slate-500">
                        Enterprise Hospital Management System
                    </p>
                </div>

                {isAdmin && (
                    //   <button
                    //     onClick={() => setIsAssignModalOpen(true)}
                    //     className="bg-slate-900 px-8 py-4 rounded-2xl font-bold text-white shadow-2xl flex items-center gap-3 hover:bg-blue-600 hover:-translate-y-1 transition-all"
                    //   >
                    //     <RiUserAddLine size={20} />
                    //     Assign New Rotation
                    //   </button>
                    <motion.button
                        {...buttonMotion}
                        onClick={() => setIsAssignModalOpen(true)}
                        className={buttonStyle}
                    >
                        <RiUserAddLine size={18} /> Assign New Rotation
                    </motion.button>
                )}
            </div>

            {/* DASHBOARD STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Day Rotation"
                    value={`${shifts.filter((s) => s.shiftType === "Day").length} Staff`}
                    color="orange"
                    icon={<RiSunFoggyLine />}
                />
                <StatCard
                    title="Night Rotation"
                    value={`${shifts.filter((s) => s.shiftType === "Night").length} Staff`}
                    color="indigo"
                    icon={<RiMoonClearLine />}
                />
                <StatCard
                    title="Active Units"
                    value="04 Units"
                    color="emerald"
                    icon={<RiBuilding4Line />}
                />
            </div>



            {/* TABS */}
            <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${currentTab === tab.id
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab.icon}
                        <span className="relative z-10">{tab.label}</span>

                        {currentTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* MAIN ROSTER CONTAINER */}
            <div className="bg-white rounded-lg border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
                            Live Facility Board
                        </h3>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or unit..."
                            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto p-6">
                    <AnimatePresence mode="wait">
                        {currentTab === "roster" && (
                            <motion.div
                                key="roster-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-2">Medical Professional</th>
                                            <th className="px-6 py-2">Department</th>
                                            <th className="px-6 py-2">Shift Window</th>
                                            <th className="px-6 py-2 text-center">Handover</th>
                                            <th className="px-6 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredShifts.map((staff, idx) => (
                                                <motion.tr
                                                    key={staff._id}
                                                    layout
                                                    // draggable={isAdmin}
                                                    // onDragStart={() => onDragStart(idx)}
                                                    // onDragOver={(e) => e.preventDefault()}
                                                    // onDrop={() => onDrop(idx)}
                                                    className={`group bg-white hover:shadow-lg hover:shadow-slate-100 transition-all border border-slate-100 rounded-2xl`}
                                                >
                                                    <td className="px-6 py-5 rounded-l-2xl">
                                                        <div className="flex items-center gap-4">
                                                            {isAdmin && (
                                                                <RiDragMove2Line className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                                                            )}
                                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 shadow-inner">
                                                                {staff.firstName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 tracking-tight">
                                                                    {staff.firstName} {staff.lastName}
                                                                </p>
                                                                <p className="text-[10px] uppercase font-black text-blue-500 tracking-wider">
                                                                    {staff.role}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <RiBuilding4Line className="text-slate-300" />{" "}
                                                            {staff.department}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                                                            {staff.shiftType === "Day" ? (
                                                                <RiSunFoggyLine className="text-orange-500" />
                                                            ) : (
                                                                <RiMoonClearLine className="text-indigo-500" />
                                                            )}
                                                            <span className="text-xs font-black text-slate-700">
                                                                {staff.startTime} - {staff.endTime}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStaff(staff);
                                                                setIsHandoverOpen(true);
                                                            }}
                                                            className="relative p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 cursor-pointer"
                                                        >
                                                            <RiChatHistoryLine size={20} />
                                                            {staff.hasUnreadNote && (
                                                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-5 rounded-r-2xl text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* EDIT BUTTON */}
                                                            <button
                                                                onClick={() => handleEditShift(staff)}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                                title="Edit Rotation"
                                                            >
                                                                <RiExchangeLine size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => toggleOnCallStatus(staff._id)}
                                                                className={`p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer ${staff.isOnCall
                                                                        ? "bg-emerald-200 border-emerald-500 text-emerald-600 rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                                                        : "bg-slate-50 border-slate-200 text-slate-400  "
                                                                    }`}
                                                                title="Toggle On-Call Status"
                                                            >
                                                                <RiAlarmWarningLine
                                                                    size={15}
                                                                    className={
                                                                        staff.isOnCall ? "animate-pulse" : ""
                                                                    }
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteShift(staff._id)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                                title="Remove from Roster"
                                                            >
                                                                <RiCloseCircleLine size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {currentTab === "oncall" && (
                            <motion.div
                                key="oncall-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center"
                            >
                                <RiAlarmWarningLine
                                    size={40}
                                    className="mx-auto text-slate-300 mb-4"
                                />
                                <h3 className="text-xl font-bold text-slate-800">
                                    Standby Monitoring
                                </h3>
                                <p className="text-slate-500">
                                    Only professionals currently marked as "On-Call" will appear
                                    here.
                                </p>
                            </motion.div>
                        )}

                        {currentTab === "logs" && (
                            <motion.div key="logs-view">
                                {/* UI for Audit Logs/History */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ASSIGNMENT MODAL */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="New Rotation Assignment"
            >
                <form onSubmit={handleAssignSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                Select Professional
                            </label>
                            <select
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-200"
                                onChange={(e) =>
                                    setNewRotation({ ...newRotation, staffId: e.target.value })
                                }
                            >
                                <option value="">Choose Staff...</option>
                                {shifts.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.firstName} {s.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                    Department Unit
                                </label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700"
                                    onChange={(e) =>
                                        setNewRotation({
                                            ...newRotation,
                                            department: e.target.value,
                                        })
                                    }
                                >
                                    <option>Emergency</option>
                                    <option>Cardiology</option>
                                    <option>Surgery</option>
                                    <option>ICU</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                    Shift Type
                                </label>
                                <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewRotation({ ...newRotation, shiftType: "Day" })
                                        }
                                        className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all ${newRotation.shiftType === "Day" ? "bg-white shadow text-orange-600" : "text-slate-400"}`}
                                    >
                                        Day
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewRotation({ ...newRotation, shiftType: "Night" })
                                        }
                                        className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all ${newRotation.shiftType === "Night" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
                                    >
                                        Night
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                    Check-In
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                    Check-Out
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsAssignModalOpen(false)}
                            className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Dismiss
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ShiftManagement;



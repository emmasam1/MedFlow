import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";

// Layout & UI Components
import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import DoctorsAppointment from "../../components/DoctorsAppointment";
import CreateQueue from "../../components/CreateQueue";
import ScheduleCard from "../../components/ScheduleCard";
import PatientQueue from "../../components/PatientQueue";

// Role-Specific Panels
import NurseTasks from "../../components/NurseTasks";
import VitalsTracker from "../../components/VitalsTracker";
import ShiftSchedule from "../../components/ShiftSchedule";
import MedicationList from "../../components/MedicationList";
import NurseTodo from "../../components/NurseTodo";
import AssignedPatients from "../../components/AssignedPatients";
import PatientNotes from "../../components/PatientNotes";
import CriticalAlerts from "../../components/RealTimeIndicator";

// Icons
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineQueue } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import {
  RiTeamLine,
  RiUserSharedLine,
  RiMoneyDollarCircleLine,
  RiShieldUserLine,
} from "react-icons/ri";

// Store
import { useStore } from "../../store/store";
import { useAppStore } from "../../store/useAppStore";

const Dashboard = () => {
  const { darkMode } = useStore();
  const { patients, appointments, fetchPatients, fetchAppointments, queue } =
    useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [recordTab, setRecordTab] = useState("appointments");

  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

 // Auth & Role
  const encryptedUser = sessionStorage.getItem("user");
  let user = null;

  if (encryptedUser) {
    try {
      // Pull the key from your .env file
      const secretKey = import.meta.env.VITE_ENCRYPTION_KEY;
      
      const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      // Check if decryptedText is empty (happens if the key is wrong)
      if (!decryptedText) {
        console.error("Decryption resulted in empty string. Check your VITE_ENCRYPTION_KEY.");
      } else {
        user = JSON.parse(decryptedText);
      }
    } catch (e) {
      console.error("Failed to decrypt user data:", e);
    }
  }

  const role = user?.role?.toLowerCase();
  console.log("Current User Role:", role);

  useEffect(() => {
    // fetchPatients();
    // fetchAppointments();
  }, []);

  /* ---------------- Computed Stats ---------------- */
 /* ---------------- Computed Stats ---------------- */
  const today = dayjs().format("YYYY-MM-DD");

  // Use optional chaining and default to empty arrays to prevent .length errors
  const safeAppointments = appointments || [];
  const safePatients = patients || [];
  const safeQueue = queue || [];

  const totalAppointments = safeAppointments.length;
  const totalPatients = safePatients.length;
  
  const newPatients = safePatients.filter((p) => p.regDate === today).length;

  const todaysQueue = safeQueue.filter(
    (q) => dayjs(q.createdAt).format("YYYY-MM-DD") === today,
  );

  const waitingQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "waiting",
  ).length;
  const doneQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "done",
  ).length;
  const urgentQueue = todaysQueue.filter(
    (q) => q.priority?.toLowerCase() === "urgent",
  ).length;

  const totalRevenue = safeQueue
    .filter((q) => q.paymentStatus === "paid" || q.paymentStatus === "partial")
    .reduce((sum, q) => sum + (q.labAmount || 0), 0);

  const pendingPayments = safeQueue.filter(
    (q) => q.paymentStatus === "pending",
  ).length;
  const totalBalance = safeQueue.reduce((sum, q) => sum + (q.balance || 0), 0);

  /* ---------------- Animations & Styles ---------------- */
  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  return (
    <>
      <ToastContainer />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-4">
        <div>
          <h2
            className={`text-2xl font-black capitalize ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            {pathName.replace(/-/g, " ")}
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            Dashboard <span className="text-[10px]">🏠</span> Home
            <span className="text-[10px]">&gt;</span>
            <span className="text-blue-500 font-medium capitalize">
              {pathName}
            </span>
          </p>
        </div>

        {/* ADMIN & RECORDS ACTION BUTTONS */}
        {["admin", "record_officer"].includes(role) && (
          <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
            <motion.button
              {...buttonMotion}
              onClick={() => setIsOpen(true)}
              className={buttonStyle}
            >
              <AiOutlineUserAdd size={18} /> Add Patient
            </motion.button>
            <motion.button
              {...buttonMotion}
              onClick={() => setIsAppointment(true)}
              className={buttonStyle}
            >
              <FiCalendar size={18} /> Appointment
            </motion.button>
            <motion.button
              {...buttonMotion}
              onClick={() => setIsQueueOpen(true)}
              className={buttonStyle}
            >
              <MdOutlineQueue size={18} /> Queue
            </motion.button>
          </div>
        )}
      </div>

      {/* STATS GRID (4 Columns) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* ADMIN VIEW */}
          {role === "admin" && (
            <>
              <StatCard title="Total Staff" value="42" color="blue" />
              <StatCard title="On Duty" value="12" color="purple" />
              <StatCard
                title="Total Revenue"
                value={`₦${totalRevenue.toLocaleString()}`}
                color="green"
              />
              <StatCard title="System Alerts" value="3" color="red" />
            </>
          )}

          {/* DOCTOR VIEW */}
          {role === "doctor" && (
            <>
              <StatCard
                title="Today Queue"
                value={todaysQueue.length}
                color="purple"
              />
              <StatCard title="Waiting" value={waitingQueue} color="orange" />
              <StatCard title="Completed" value={doneQueue} color="green" />
              <StatCard title="Urgent" value={urgentQueue} color="red" />
            </>
          )}

          {/* NURSE VIEW */}
          {role === "nurse" && (
            <>
              <StatCard title="Assigned Patients" value="8" color="blue" />
              <StatCard title="Pending Tasks" value="5" color="orange" />
              <StatCard title="Completed" value="12" color="green" />
              <StatCard title="Critical Alerts" value="2" color="red" />
            </>
          )}

          {/* FINANCE VIEW */}
          {role === "finance_officer" && (
            <>
              <StatCard
                title="Revenue"
                value={`₦${totalRevenue}`}
                color="green"
              />
              <StatCard
                title="Pending"
                value={pendingPayments}
                color="orange"
              />
              <StatCard
                title="Outstanding"
                value={`₦${totalBalance}`}
                color="red"
              />
              <StatCard title="Paid Count" value={doneQueue} color="blue" />
            </>
          )}

          {/* RECORD OFFICER VIEW (Uses Toggle Logic) */}
          {role === "record_officer" && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Patients"
                value={totalPatients}
                color="blue"
              />
              <StatCard title="New Today" value={newPatients} color="green" />
              <StatCard
                title="Appointments"
                value={totalAppointments}
                color="purple"
              />
              <StatCard
                title="Active Queue"
                value={waitingQueue}
                color="orange"
              />
            </div>
          )}
        </div>

        {/* MAIN DASHBOARD LAYOUTS */}
        <div className="px-4">
          {/* ADMIN & DOCTOR & SPECIALIST GRID */}
          {(role === "admin" || role === "doctor" || role === "specialist") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 shadow-sm rounded-3xl overflow-hidden">
                <PatientChart />
              </div>
              <div className="space-y-6">
                <ScheduleCard />
                {role === "doctor" ? <PatientQueue /> : <CriticalAlerts />}
              </div>
            </div>
          )}

          {/* NURSE SPECIFIC LAYOUT */}
          {role === "nurse" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PatientChart />
                <NurseTasks />
                <ShiftSchedule shifts={[{ time: "8AM-4PM", notes: "Day" }]} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <MedicationList />
                <NurseTodo />
                <div className="space-y-6">
                  <AssignedPatients />
                  <CriticalAlerts />
                </div>
              </div>
            </>
          )}

          {/* RECORD OFFICER LAYOUT */}
          {role === "record_officer" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PatientChart />
              <div className="space-y-6">
                <BookAppointment />
                <NewPatientChart />
              </div>
              <Appointments />
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: DATA TABLES */}
        <div className="px-4 pb-10">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
            <AppointmentTable />
          </div>
        </div>
      </motion.div>

      {/* MODAL PORTALS */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Patient"
        size="2xl"
      >
        <AddPatients onSuccess={() => setIsOpen(false)} />
      </Modal>

      <Modal
        isOpen={isAppointment}
        onClose={() => setIsAppointment(false)}
        title="Create Appointment"
        size="3xl"
      >
        <DoctorsAppointment onSuccess={() => setIsAppointment(false)} />
      </Modal>

      <Modal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        title="Patient Queue"
        size="3xl"
      >
        <CreateQueue onSuccess={() => setIsQueueOpen(false)} />
      </Modal>
    </>
  );
};

export default React.memo(Dashboard);

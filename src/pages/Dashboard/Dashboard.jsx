import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";

import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import DoctorsAppointment from "../../components/DoctorsAppointment";

import PatientQueue from "../../components/PatientQueue";

import { AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineQueue } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";

import { useStore } from "../../store/store";
import { useAppStore } from "../../store/useAppStore";
import CreateQueue from "../../components/CreateQueue";
import ScheduleCard from "../../components/ScheduleCard";
import NurseTasks from "../../components/NurseTasks";
import VitalsTracker from "../../components/VitalsTracker";
import ShiftSchedule from "../../components/ShiftSchedule";
import MedicationPanel from "../../components/MedicationPanel";
import AssignedPatients from "../../components/AssignedPatients";
import CriticalAlerts from "../../components/CriticalAlerts";
import PatientNotes from "../../components/PatientNotes";

const Dashboard = () => {
  const { darkMode } = useStore();
  const {
    patients,
    appointments,
    fetchPatients,
    fetchAppointments,
    getQueue,
    queue,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const [recordTab, setRecordTab] = useState("appointments");

  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  /* ---------------- Stats ---------------- */

  const totalAppointments = appointments.length;

  const cancelledAppointments = appointments.filter(
    (q) => q.status?.toLowerCase() === "cancelled",
  ).length;

  const totalQueue = queue.length;

  const today = dayjs().format("YYYY-MM-DD");

  const todaysQueue = queue.filter(
    (q) => dayjs(q.createdAt).format("YYYY-MM-DD") === today,
  );

  const waitingQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "waiting",
  ).length;

  const doneQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "done",
  ).length;

  const cancelledQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "cancel",
  ).length;

  const urgentQueue = todaysQueue.filter(
    (q) => q.priority?.toLowerCase() === "urgent",
  ).length;

  const totalPatients = patients.length;

  // const today = new Date().toISOString().split("T")[0];

  const newPatients = patients.filter((p) => p.regDate === today).length;

  const totalRevenue = queue
    .filter((q) => q.paymentStatus === "paid" || q.paymentStatus === "partial")
    .reduce((sum, q) => sum + (q.labAmount || 0), 0);

  const pendingPayments = queue.filter(
    (q) => q.paymentStatus === "pending",
  ).length;

  const totalBalance = queue.reduce((sum, q) => sum + (q.balance || 0), 0);

  const paidCount = queue.filter((q) => q.paymentStatus === "paid").length;

  /* ---------------- Button Animation ---------------- */

  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-3 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer";

  return (
    <>
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-8 gap-4 px-4">
        <div>
          <h2
            className={`text-xl font-bold capitalize ${darkMode ? "text-white" : "text-slate-800"
              }`}
          >
            {pathName.replace(/-/g, " ")}
          </h2>

          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
            Dashboard <span className="text-[10px]">🏠</span> Home{" "}
            <span className="text-[10px]">&gt;</span>
            <span className="text-blue-500 font-medium capitalize">
              {pathName}
            </span>
          </p>
        </div>

        {/* ACTION BUTTONS */}
        {user?.role?.toLowerCase() === "doctor" ||
          user?.role?.toLowerCase() === "specialist" || user?.role?.toLowerCase() === "lab_officer" ||
          user?.role?.toLowerCase() === "nurse" ||
          user?.role?.toLowerCase() === "finance_officer" ||
          user?.role?.toLowerCase() === "specialist" ? null : (
          <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
            {/* ADD PATIENT */}
            <motion.button
              {...buttonMotion}
              onClick={() => setIsOpen(true)}
              className={buttonStyle}
            >
              <AiOutlineUserAdd size={18} />
              Add Patient
            </motion.button>

            {/* APPOINTMENT */}
            <motion.button
              {...buttonMotion}
              onClick={() => setIsAppointment(true)}
              className={buttonStyle}
            >
              <FiCalendar size={18} />
              Appointment
            </motion.button>

            {/* QUEUE */}
            <motion.button
              {...buttonMotion}
              onClick={() => setIsQueueOpen(true)}
              className={buttonStyle}
            >
              <MdOutlineQueue size={18} />
              Queue
            </motion.button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {user?.role?.toLowerCase() === "doctor" && (
            <>
              {/* <StatCard title="Total Queue" value={totalQueue} color="purple" />
              <StatCard
                title="Cancelled Queue"
                value={cancelledQueue}
                color="orange"
              />
              <StatCard
                title="Completed Queue"
                value={doneQueue}
                color="blue"
              />
              <StatCard
                title="Waiting Queue"
                value={waitingQueue}
                color="green"
              /> */}
              <>
                <StatCard
                  title="Today Queue"
                  value={totalQueue}
                  color="purple"
                />
                <StatCard
                  title="Waiting Patients"
                  value={waitingQueue}
                  color="orange"
                />
                <StatCard title="Completed" value={doneQueue} color="green" />
                <StatCard
                  title="Urgent Cases"
                  value={urgentQueue}
                  color="red"
                />
              </>
            </>
          )}

          {user?.role?.toLowerCase() === "specialist" && (
            <>
              <StatCard
                title="Specialist Appointments"
                value={totalAppointments}
                color="purple"
              />
              <StatCard
                title="Cancelled Appointments"
                value={cancelledAppointments}
                color="orange"
              />
              <StatCard
                title="Waiting Patients"
                value={totalPatients}
                color="blue"
              />
              <StatCard
                title="Urgent Cases"
                value={newPatients}
                color="red"
              />
            </>
          )}

          {user?.role?.toLowerCase() === "nurse" && (
            <>
              <StatCard
                title="Assigned Patients"
                value="0"
                // value={assignedPatients?.length || 0}
                color="blue"
              />
              <StatCard
                title="Pending Tasks"
                value={waitingQueue} // temporary
                color="orange"
              />
              <StatCard
                title="Completed Tasks"
                value={doneQueue}
                color="green"
              />
              <StatCard
                title="Critical Alerts"
                value={0} // replace later with real alerts
                color="red"
              />
            </>
          )}

          {user?.role?.toLowerCase() === "lab_officer" && (
            <>
              <StatCard
                title="Total Tests"
                value="0"
                // value={assignedPatients?.length || 0}
                color="blue"
              />
              <StatCard
                title="Pending Tests"
                value={waitingQueue} // temporary
                color="orange"
              />
              <StatCard
                title="Completed Tests"
                value={doneQueue}
                color="green"
              />
              <StatCard
                title="Delivered Test"
                value={0} // replace later with real alerts
                color="red"
              />
            </>
          )}

          {user?.role?.toLowerCase() === "record_officer" && (
            <div className="col-span-full">
              {/* 🔥 TOGGLE */}
              <div className="flex gap-2 mb-4 relative">
                {["appointments", "queue"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRecordTab(tab)}
                    className="relative px-3 py-1 text-xs font-semibold capitalize"
                  >
                    {recordTab === tab && (
                      <motion.div
                        layoutId="recordToggle"
                        className="absolute inset-0 bg-blue-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}

                    <span
                      className={`relative z-10 ${recordTab === tab ? "text-white" : "text-gray-500"
                        }`}
                    >
                      {tab}
                    </span>
                  </button>
                ))}
              </div>

              {/* 🔥 CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  key={recordTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="contents"
                >
                  {recordTab === "appointments" ? (
                    <>
                      <StatCard
                        title="Appointments"
                        value={totalAppointments}
                        color="purple"
                      />
                      <StatCard
                        title="Cancelled Appointments"
                        value={cancelledAppointments}
                        color="orange"
                      />
                    </>
                  ) : (
                    <>
                      <StatCard
                        title="Total Queue"
                        value={totalQueue}
                        color="purple"
                      />
                      <StatCard
                        title="Cancelled Queue"
                        value={cancelledQueue}
                        color="orange"
                      />
                    </>
                  )}

                  {/* ALWAYS STATIC */}
                  <StatCard
                    title="Total Patients"
                    value={totalPatients}
                    color="blue"
                  />
                  <StatCard
                    title="New Patients"
                    value={newPatients}
                    color="green"
                  />
                </motion.div>
              </div>
            </div>
          )}

          {user?.role?.toLowerCase() === "finance_officer" && (
            <>
              <StatCard
                title="Revenue"
                value={`₦${totalRevenue}`}
                color="green"
              />
              <StatCard
                title="Pending Payments"
                value={pendingPayments}
                color="orange"
              />
              <StatCard
                title="Outstanding Balance"
                value={`₦${totalBalance}`}
                color="red"
              />
              <StatCard
                title="Paid Transactions"
                value={paidCount}
                color="blue"
              />
            </>
          )}
        </div>

        {/* MIDDLE SECTION */}
        {user?.role === "nurse" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientChart />
            <NurseTasks />
            <ShiftSchedule
              shifts={[
                { time: "8AM-4PM", notes: "Day Shift" },
                { time: "4PM-12AM", notes: "Evening Shift" },
              ]}
            />
          </div>
        )}

        {user?.role === "doctor" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientChart />
            <ScheduleCard />
            <PatientQueue />
          </div>
        )}

        {user?.role === "specialist" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientChart />
            <ScheduleCard />
            <Appointments />
          </div>
        )}

        {user?.role === "record_officer" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientChart />
            <Appointments />
            <BookAppointment />
          </div>
        )}
      </motion.div>

      {user?.role?.toLowerCase() === "nurse" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <VitalsTracker />
          {/* <MedicationPanel medications={[
          { name: "Paracetamol", dosage: "500mg", status: "pending" },
          { name: "Ibuprofen", dosage: "200mg", status: "administered" }
        ]} /> */}
          <div className="space-y-6">
            <AssignedPatients />
            {/* <AssignedPatients patients={assignedPatients} /> */}
            <PatientNotes patientId={1} />
            <CriticalAlerts />
            {/* <CriticalAlerts alerts={criticalAlerts.map(a => ({ message: `Patient ${a.patientName} requires attention!` }))} /> */}
          </div>
        </div>
      )}

      {user?.role?.toLowerCase() === "lab_officer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <VitalsTracker />
          {/* <MedicationPanel medications={[
          { name: "Paracetamol", dosage: "500mg", status: "pending" },
          { name: "Ibuprofen", dosage: "200mg", status: "administered" }
        ]} /> */}
          <div className="space-y-6">
            <AssignedPatients />
            {/* <AssignedPatients patients={assignedPatients} /> */}
            <PatientNotes patientId={1} />
            <CriticalAlerts />
            {/* <CriticalAlerts alerts={criticalAlerts.map(a => ({ message: `Patient ${a.patientName} requires attention!` }))} /> */}
          </div>
        </div>
      )}

      {/* BOTTOM SECTION */}
      <div
        className={`mt-6 ${role === "doctor" || role === "finance" || role === "finance_officer" || role === "specialist"
          ? ""
          : "flex flex-col md:flex-row gap-4"
          }`}
      >
        <div
          className={`${role === "doctor" ||
            role === "finance" ||
            role === "specialist" ||
            role === "finance_officer"
            ? "w-full"
            : "md:w-2/3"
            }`}
        >
          <AppointmentTable />
        </div>

        {role === "record_officer" && (
          <div className="md:w-1/3">
            <NewPatientChart />
          </div>
        )}
      </div>

      {/* ADD PATIENT MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Patient"
        size="2xl"
      >
        <AddPatients onSuccess={() => setIsOpen(false)} />
      </Modal>

      {/* APPOINTMENT MODAL */}
      <Modal
        isOpen={isAppointment}
        onClose={() => setIsAppointment(false)}
        title="Create Appointment"
        size="3xl"
      >
        <DoctorsAppointment onSuccess={() => setIsAppointment(false)} />
      </Modal>

      {/* QUEUE MODAL */}
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

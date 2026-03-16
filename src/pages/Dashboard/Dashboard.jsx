import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

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

  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  /* ---------------- Stats ---------------- */

  const totalAppointments = appointments.length;
  const totalQueue = queue.length

  const cancelledAppointments = appointments.filter(
    (appt) => appt.status?.toLowerCase() === "cancelled",
  ).length;

  const cancelledQueue = queue.filter(
    (appt) => appt.status?.toLowerCase() === "cancel"
  ).length

  const doneQueue = queue.filter(
    (appt) => appt.status?.toLowerCase() === "done"
  ).length

  const waitingQueue = queue.filter(
    (appt) => appt.status?.toLowerCase() === "waiting"
  ).length

  const totalPatients = patients.length;

  const today = new Date().toISOString().split("T")[0];

  const newPatients = patients.filter((p) => p.regDate === today).length;

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
            className={`text-xl font-bold capitalize ${
              darkMode ? "text-white" : "text-slate-800"
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
              <StatCard
                title="Completed Queue"
                value={doneQueue}
                color="blue"
              />
              <StatCard
                title="Waiting Queue"
                value={waitingQueue}
                color="green"
              />
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
                title="Total Patients"
                value={totalPatients}
                color="blue"
              />
              <StatCard
                title="New Patients"
                value={newPatients}
                color="green"
              />
            </>
          )}

          {user?.role?.toLowerCase() !== "doctor" &&
            user?.role?.toLowerCase() !== "specialist" && (
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
              </>
            )}
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PatientChart />
          {user?.role?.toLowerCase() === "doctor" ||
          user?.role?.toLowerCase === "specialist" ? (
            <ScheduleCard />
          ) : (
            <Appointments />
          )}
          {user?.role?.toLowerCase() === "doctor" ? (
            <PatientQueue />
          ) : (
            <BookAppointment />
          )}
        </div>
      </motion.div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <div className="md:w-2/3">
          <AppointmentTable />
        </div>

        <div className="md:w-1/3">
          <NewPatientChart />
        </div>
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

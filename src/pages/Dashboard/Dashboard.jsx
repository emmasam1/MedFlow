import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useLocation } from "react-router-dom";

import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";
import { useStore } from "../../store/store";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import DoctorsAppointment from "../../components/DoctorsAppointment";
// import locationsNg from "locations-ng"
import { useAppStore } from "../../store/useAppStore";

const Dashboard = () => {
  const { darkMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const { patients, appointments, fetchPatients, fetchAppointments } = useAppStore();

// all states
// locationsNg.state.all()

// LGAs in a state
// const data = locationsNg.lga.lgas("Kogi")

// localities for a given LGA
// locationsNg.lga.localities("Abia", "Aba North")

// console.log(data)


  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  // 📊 Compute stats properly
  const totalAppointments = appointments.length;

  const cancelledAppointments = appointments.filter(
    (appt) => appt.status?.toLowerCase() === "cancelled",
  ).length;

  const totalPatients = patients.length;

  const today = new Date().toISOString().split("T")[0]; // "2026-02-22"

  const newPatients = patients.filter((p) => p.regDate === today).length;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-8 gap-4 px-4">
        <div>
          <h2
            className={`text-xl font-bold capitalize ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            {pathName.replace(/-/g, " ")}
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
            Dashboard <span className="text-[10px]">🏠</span> Home{" "}
            <span className="text-[10px]">&gt;</span>{" "}
            <span className="text-blue-500 font-medium capitalize">
              {pathName}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="hover:bg-[#9DCEF8]! px-3 py-2 rounded-full! 
               text-[#005CBB]! font-bold flex items-center gap-2
               transition-colors duration-300 text-sm cursor-pointer"
            >
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center gap-2"
              >
                <AiOutlineUserAdd size={18} />
                Add Patient
              </motion.span>
            </button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <button
              onClick={() => setIsAppointment(true)}
              className="hover:bg-[#9DCEF8]! px-3 py-2 rounded-full! 
               text-[#005CBB]! font-bold flex items-center gap-2
               transition-colors duration-300 text-sm cursor-pointer"
            >
              📅 Appointment
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <StatCard title="Total Patients" value={totalPatients} color="blue" />

          <StatCard title="New Patients" value={newPatients} color="green" />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          <PatientChart />
          <Appointments />
          <BookAppointment />
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <div className="md:w-2/3">
          <AppointmentTable />
        </div>
        <div className="md:w-1/3">
          <NewPatientChart />
        </div>
      </div>

      {/* {Add New Patient Modal} */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Patient"
        size="2xl"
      >
        <AddPatients onSuccess={() => setIsOpen(false)} />
      </Modal>

      {/* {Appointment Modal} */}
      <Modal
        isOpen={isAppointment}
        onClose={() => setIsAppointment(false)}
        title="Create Appointment"
        size="3xl"
      >
        <DoctorsAppointment onSuccess={() => setIsAppointment(false)} />
      </Modal>
    </>
  );
};

export default React.memo(Dashboard);

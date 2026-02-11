import React, { useState } from "react";
import { motion } from "framer-motion";
import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import DoctorStatus from "../../components/DoctorStatus";
import { Link } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useLocation } from "react-router-dom";

import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";
import { useStore } from "../../store/store";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";

const Dashboard = () => {
  const { darkMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";
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
          <StatCard title="Appointments" value="650" color="purple" />
          <StatCard title="Cancelled Appointments" value="54" color="orange" />
          <StatCard title="Total Patients" value="20125" color="blue" />
          <StatCard title="New Patients" value="129" color="green" />
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
          Patient Registration
        </h2>
        <AddPatients />
      </Modal>
    </>
  );
};

export default Dashboard;

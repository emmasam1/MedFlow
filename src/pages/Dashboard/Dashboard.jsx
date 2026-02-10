import React, { useState } from "react";
import { motion } from "framer-motion";
import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import DoctorStatus from "../../components/DoctorStatus";
import { Link } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";

import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";

const Dashboard = () => {
  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to="/dashboard/patients-add"
              className="hover:bg-[#9DCEF8]! px-3 py-2 rounded-full! 
               text-[#005CBB]! font-bold flex items-center gap-2
               transition-colors duration-300"
            >
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center gap-2"
              >
                <AiOutlineUserAdd size={18} />
                Add Patient
              </motion.span>
            </Link>
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
    </>
  );
};

export default Dashboard;

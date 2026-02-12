import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddPatients from "../../components/AddPatients";
import { useStore } from "../../store/store";
import Modal from "../../components/Modal";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const initialPatients = [
  {
    id: 1,
    name: "Ashton Cox",
    treatment: "Malaria",
    gender: "male",
    mobile: "1234567890",
    status: "Recovered",
  },
  {
    id: 2,
    name: "Jessica Wong",
    treatment: "Dengue",
    gender: "female",
    mobile: "9876543210",
    status: "Under Treatment",
  },
];

const Patients = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useStore();

  const handleChange = (e) => {
    setSelectedPatient({
      ...selectedPatient,
      [e.target.name]: e.target.value,
    });
  };

  const savePatient = () => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id ? selectedPatient : p
      )
    );
    setSelectedPatient(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        {/* ================= TOP BAR ================= */}
        <div className="mb-6">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
        <span className="font-semibold text-gray-800">
            All Patients
        </span>

        <span className="mx-2">›</span>

        <HomeIcon className="w-4 h-4" />

        <span className="mx-2">›</span>
        Patients

        <span className="mx-2">›</span>
        All Patients
        </div>

        {/* Toolbar Container */}
        <div className="bg-[#eef2fb] rounded-xl px-6 py-4 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-6">

            <h2 className="text-lg font-semibold text-gray-800">
            Patients
            </h2>

            {/* Search */}
            <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">

            <FunnelIcon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition" />

            <PlusCircleIcon onClick={() => setIsOpen(true)} className="w-6 h-6 text-green-600 cursor-pointer hover:scale-110 transition" />

            <ArrowPathIcon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition" />

            <ArrowDownTrayIcon className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800 transition" />

        </div>
        </div>
        </div>

        {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Treatment</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-4 py-3 font-medium">
                  {patient.name}
                </td>

                <td className="px-4 py-3">
                  {patient.treatment}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      patient.gender === "male"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {patient.gender}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {patient.mobile}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      patient.status === "Recovered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>

                <td
                  className="px-4 py-3 flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PencilSquareIcon
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  />
                  <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
        <AnimatePresence>
            {selectedPatient && (
                <motion.div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                {/* Modal Container */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <img
                        src="https://i.pravatar.cc/40"
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                        />
                        <h2 className="text-lg font-semibold">
                        Edit {selectedPatient.name}
                        </h2>
                    </div>

                    <button onClick={() => setSelectedPatient(null)}>
                        ✕
                    </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Age */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Age*
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            defaultValue="30"
                        />
                        </div>

                        {/* Email */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Email*
                        </label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            defaultValue="ashton.cox@example.com"
                        />
                        </div>

                        {/* Admission Date */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Admission Date*
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        </div>

                        {/* Discharge Date */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Discharge Date
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        </div>

                        {/* Doctor */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Doctor Assigned*
                        </label>
                        <input
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            defaultValue="Dr. John Doe"
                        />
                        </div>

                        {/* Status */}
                        <div>
                        <label className="text-sm text-gray-600">
                            Status*
                        </label>
                        <select className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option>Recovered</option>
                            <option>Under Treatment</option>
                            <option>Under Observation</option>
                        </select>
                        </div>

                        {/* Address (full width) */}
                        <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">
                            Address
                        </label>
                        <textarea
                            rows="3"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            defaultValue="11, Shyam Appt., Rajkot"
                        />
                        </div>
                    </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 px-6 py-4 border-t">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                        Save
                    </button>
                    <button
                        onClick={() => setSelectedPatient(null)}
                        className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
                    >
                        Cancel
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Patient Registration
            </h2>
        <AddPatients />
      </Modal>

    </div>
  );
};

export default Patients;



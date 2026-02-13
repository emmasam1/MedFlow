import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import { FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";

const Patients = () => {

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, patients  } = useStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


  const columns = [
    { title: "Card No", key: "patientId", sortable: true },
    { title: "Full Name", key: "fullName", sortable: true },
    { title: "Patient type", key: "patientType", sortable: true },
    { title: "Gender", key: "gender" },
    { title: "Age", key: "age", sortable: true },
    { title: "Phone", key: "phone" },
    {
      title: "Status",
      key: "status",
      render: (value) => (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
          {value}
        </span>
      ),
    },
  ];

  // ------------------ DELETE ------------------
  const confirmDelete = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    setPatientsData((prev) => prev.filter((p) => p.id !== selectedPatient.id));
    setIsDeleteOpen(false);
  };

  // const handleChange = (e) => {
  //   setSelectedPatient({
  //     ...selectedPatient,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const savePatient = () => {
  //   setPatientsData((prev) =>
  //     prev.map((p) => (p.id === selectedPatient.id ? selectedPatient : p)),
  //   );
  //   setSelectedPatient(null);
  // };

  const Input = ({ label, value, type = "text", disabled }) => (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-2 block">
        {label}
      </label>
      <input
        type={type}
        defaultValue={value}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-2xl border text-sm transition
        ${
          disabled
            ? "bg-gray-100 border-gray-200 cursor-not-allowed"
            : "border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        }`}
      />
    </div>
  );

  const Select = ({ label, value, options }) => (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-2 block">
        {label}
      </label>
      <select
        defaultValue={value}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Table */}
      <div className=" overflow-hidden">
        <DataTable
          columns={columns}
          data={patients }
          searchableKeys={["fullName", "patientId", "phone"]}
          onRowClick={(row) => setEditPatient(row)} // open on row click
          actions={(row) => (
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Link to={`/dashboard/patient-profile/${row.id}`}>
                <FiEye className="text-gray-500 cursor-pointer hover:text-black" />
              </Link>

              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => setEditPatient(row)}
              />
              <FiTrash2
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => confirmDelete(row)}
              />
            </div>
          )}
        />
      </div>

      {/* ================= MODAL ADD PATIENT ================= */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2
          className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          Patient Registration
        </h2>
        <AddPatients />
      </Modal>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[400px] rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-2">Delete Patient?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{selectedPatient?.fullName}</span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================== EDIT PATIENTS ========================*/}
      <AnimatePresence>
        {editPatient && (
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
                    Edit {editPatient.name}
                  </h2>
                </div>

                <button
                  onClick={() => setEditPatient(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Age */}
                  <div>
                    <label className="text-sm text-gray-600">Age*</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      defaultValue="30"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm text-gray-600">Email*</label>
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
                    <label className="text-sm text-gray-600">Status*</label>
                    <select className="w-full border rounded-lg px-3 py-2 mt-1">
                      <option>Recovered</option>
                      <option>Under Treatment</option>
                      <option>Under Observation</option>
                    </select>
                  </div>

                  {/* Address (full width) */}
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Address</label>
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
                  onClick={() => setEditPatient(null)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { PiPrinterLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import PatientIDCard from "../../components/PatientIDCard";
import EditPatientModal from "../../components/EditPatientModal";
import { useAppStore } from "../../store/useAppStore";

const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, deletePatient } = useStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [printPatient, setPrintPatient] = useState(null);
  const printRef = useRef();

  const { fetchPatients, patients } = useAppStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const columns = [
    { title: "Card No", key: "cardNumber", sortable: true },
    { title: "Full Name", key: "fullName", render: (v) => <span className="capitalize">{v}</span> },
    { title: "Patient type", key: "patientType", render: (v) => <span className="capitalize">{v}</span> },
    {
      title: "Gender",
      key: "gender",
      render: (v) => {
        if (!v) return "—";
        const gender = v.toLowerCase();
        const bgColor = gender === "male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600";
        const label = gender === "male" ? "M" : "F";
        return (
          <div className="flex justify-center items-center">
            <div className={`flex justify-center items-center w-8 h-8 rounded-full ${bgColor}`}>
              <span className="m-auto">{label}</span>
            </div>
          </div>
        );
      },
    },
    { title: "Age", key: "age", sortable: true },
    { title: "Phone", key: "phone" },
    {
      title: "Status",
      key: "status",
      render: (v) => (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">{v}</span>
      ),
    },
  ];

  const confirmDelete = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPatient) return;
    deletePatient(selectedPatient.id);
    setIsDeleteOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    if (printPatient) handlePrint();
  }, [printPatient]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: printPatient?.fullName || "Patient ID Card",
  });

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} p-4 min-h-screen`}>
      {/* Table */}
      <div className="overflow-hidden">
        <DataTable
          columns={columns}
          data={patients.map((p) => ({ ...p, age: calculateAge(p.dob) }))}
          searchableKeys={["fullName", "patientId", "phone"]}
          actions={(row) => (
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Link to={`/dashboard/patient-profile/${row.id}`}>
                <FiEye className={`cursor-pointer ${darkMode ? "text-gray-200 hover:text-white" : "text-gray-500 hover:text-black"}`} />
              </Link>
              <FiEdit
                className={`cursor-pointer ${darkMode ? "text-blue-400 hover:text-blue-200" : "text-blue-500 hover:text-blue-700"}`}
                onClick={() => setEditPatient(row)}
              />
              <FiTrash2
                className={`cursor-pointer ${darkMode ? "text-red-400 hover:text-red-200" : "text-red-500 hover:text-red-700"}`}
                onClick={() => confirmDelete(row)}
              />
              <PiPrinterLight
                className={`cursor-pointer ${darkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-black"}`}
                onClick={() => {
                  setPrintPatient(row);
                  handlePrint();
                }}
              />
            </div>
          )}
        />
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <PatientIDCard ref={printRef} patient={printPatient} />
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>Patient Registration</h2>
        <AddPatients />
      </Modal>

      {/* Delete Modal */}
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
              className={`${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} w-[400px] rounded-2xl shadow-2xl p-6`}
            >
              <h3 className="text-lg font-semibold mb-2">Delete Patient?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-medium">{selectedPatient?.fullName}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className={`${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-100" : "bg-gray-100 hover:bg-gray-200 text-gray-900"} px-4 py-2 rounded-xl`}
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

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {editPatient && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} w-full max-w-4xl rounded-xl shadow-xl overflow-hidden`}
            >
              <EditPatientModal patient={editPatient} onClose={() => setEditPatient(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;
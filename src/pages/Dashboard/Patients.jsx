import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import { FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { PiPrinterLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import PatientIDCard from "../../components/PatientIDCard";
import EditPatientModal from "../../components/EditPatientModal";

const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, patients, deletePatient } = useStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [printPatient, setPrintPatient] = useState(null);
  const printRef = useRef();

  const navigate = useNavigate();

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
    if (!selectedPatient) return;
    deletePatient(selectedPatient.id);
    setIsDeleteOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    if (printPatient) {
      handlePrint();
    }
  }, [printPatient]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printPatient?.fullName || "Patient ID Card",
  });

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
          data={patients}
          searchableKeys={["fullName", "patientId", "phone"]}
          // onRowClick={(row) => navigate(`/dashboard/patient-profile/${row.id}`)}
          actions={(row) => (
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Link to={`/dashboard/patient-profile/${row.id}`}>
                <FiEye className="text-gray-500 cursor-pointer hover:text-black" />
              </Link>

              <FiEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => {
                  setEditPatient(row);
                }}
              />
              <FiTrash2
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => confirmDelete(row)}
              />
              <PiPrinterLight
                className="cursor-pointer"
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
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden"
            >
              <EditPatientModal
                patient={editPatient}
                onClose={() => setEditPatient(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;

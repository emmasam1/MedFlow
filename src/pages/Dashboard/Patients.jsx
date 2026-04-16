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

  const { getPatients, patients, updatePatient } = useAppStore();

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  // console.log(patients);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "—";
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return age;
  };

  const columns = [
    {
      title: "Card No",
      dataIndex: "patientId", // Fixed key
      key: "patientId",
      sortable: true,
    },
    {
      title: "Full Name",
      key: "fullName",
      // Ant Design Table uses (text, record) for render
      render: (_, record) => (
        <span className="capitalize font-medium">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Patient type",
      dataIndex: "registrationType",
      key: "registrationType",
      render: (v) => <span className="capitalize">{v?.toLowerCase()}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (v) => {
        if (!v) return "—";
        const gender = v.toLowerCase();
        const isMale = gender === "male";
        const bgColor = isMale
          ? "bg-blue-100 text-blue-600"
          : "bg-pink-100 text-pink-600";
        const label = isMale ? "M" : "F";
        return (
          <div className="flex justify-center items-center">
            <div
              className={`flex justify-center items-center w-8 h-8 rounded-full font-bold text-xs ${bgColor}`}
            >
              {label}
            </div>
          </div>
        );
      },
    },
    {
      title: "Age",
      dataIndex: "dateOfBirth", // This must match the key in your DB object
      key: "dateOfBirth",
      render: (dateOfBirth) => (
        <span className="font-medium">
          {calculateAge(dateOfBirth)}{" "}
          {calculateAge(dateOfBirth) !== "—" ? "yrs" : ""}
        </span>
      ),
    },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v) => (
        <span
          className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
            v === "active"
              ? "bg-green-100 text-green-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {v}
        </span>
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
    if (printPatient) {
      handlePrint();
    }
  }, [printPatient]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printPatient?.fullName || "Patient ID Card",
  });

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} p-4 min-h-screen`}
    >
      {/* Table */}
      <div className="overflow-hidden">
        <DataTable
          columns={columns}
          data={patients}
          searchableKeys={["firstName", "lastName", "patientId", "phoneNumber"]}
          actions={(row) => (
            <div className="flex mt-2" onClick={(e) => e.stopPropagation()}>
              <Link to={`/dashboard/patient-profile/${row.id}`}>
                <div
                  className={`p-2 rounded-full cursor-pointer transition ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-200 hover:text-white"
                      : "hover:bg-gray-200 text-gray-500 hover:text-black"
                  }`}
                >
                  <FiEye />
                </div>
              </Link>

              <div
                className={`p-2 rounded-full cursor-pointer transition ${
                  darkMode
                    ? "hover:bg-blue-900 text-blue-400 hover:text-blue-200"
                    : "hover:bg-blue-100 text-blue-500 hover:text-blue-700"
                }`}
                onClick={() => setEditPatient(row)}
              >
                <FiEdit />
              </div>

              <div
                className={`p-2 rounded-full cursor-pointer transition ${
                  darkMode
                    ? "hover:bg-red-900 text-red-400 hover:text-red-200"
                    : "hover:bg-red-100 text-red-500 hover:text-red-700"
                }`}
                onClick={() => confirmDelete(row)}
              >
                <FiTrash2 />
              </div>

              <div
                className={`p-2 rounded-full cursor-pointer transition ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-200 hover:text-white"
                    : "hover:bg-gray-200 text-gray-700 hover:text-black"
                }`}
                onClick={() => {
                  setPrintPatient(row);
                  handlePrint();
                }}
              >
                <PiPrinterLight />
              </div>
            </div>
          )}
        />
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <PatientIDCard ref={printRef} patient={printPatient} />
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2
          className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          Patient Registration
        </h2>
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
                Are you sure you want to delete{" "}
                <span className="font-medium">{selectedPatient?.fullName}</span>
                ? This action cannot be undone.
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
              <EditPatientModal
                patient={editPatient}
                onClose={() => setEditPatient(null)}
                onSave={async (updatedData) => {
                  try {
                    await updatePatient(updatedData.id, updatedData); // updatePatient from useAppStore
                    getPatients(); // refresh list
                    setEditPatient(null); // close modal
                    alert("Patient updated successfully");
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;

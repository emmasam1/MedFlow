import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "../../components/CustomTable"; 
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { PiPrinterLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import PatientIDCard from "../../components/PatientIDCard";
import EditPatientModal from "../../components/EditPatientModal";
import { useAppStore } from "../../store/useAppStore";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { BsQrCodeScan } from "react-icons/bs";
import { Tooltip } from "antd";

const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [printPatient, setPrintPatient] = useState(null);
  
  const { darkMode, deletePatient } = useStore();
  const { getPatients, patients, updatePatient } = useAppStore();
  const printRef = useRef();

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "—";
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const columns = [
    {
      title: "Card No",
      key: "patientId",
      sortable: true,
    },
    {
      title: "Full Name",
      key: "fullName",
      render: (_, record) => (
        <span className="capitalize font-medium">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Patient type",
      key: "registrationType",
      render: (v) => <span className="capitalize text-[11px] opacity-80">{v?.toLowerCase()}</span>,
    },
    {
      title: "Gender",
      key: "gender",
      render: (v) => {
        if (!v) return "—";
        const isMale = v.toLowerCase() === "male";
        return (
          <div className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-[10px] ${isMale ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}>
            {isMale ? "M" : "F"}
          </div>
        );
      },
    },
    {
      title: "Age",
      key: "dateOfBirth",
      render: (v) => <span className="font-medium text-xs">{calculateAge(v)} yrs</span>,
    },
    { title: "Phone", key: "phoneNumber" },
    {
      title: "Status",
      key: "status",
      render: (v) => (
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-tighter ${v === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
          {v}
        </span>
      ),
    },
  ];

  const toolbarActions = (
    <div className="flex items-center gap-3">
      <Tooltip title="Add New Patient">
        <PlusCircleIcon
          onClick={() => setIsAddOpen(true)}
          className="w-6 h-6 text-green-600 cursor-pointer hover:scale-110 transition"
        />
      </Tooltip>
      <Tooltip title="Scan QR Code">
        <BsQrCodeScan
          className="w-5 h-5 cursor-pointer hover:text-blue-500 transition text-gray-400"
        />
      </Tooltip>
    </div>
  );

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printPatient?.fullName || "Patient ID Card",
  });

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} min-h-screen p-4`}>
      <CustomTable
        title="Patients"
        columns={columns}
        data={patients}
        searchableKeys={["firstName", "lastName", "patientId", "phoneNumber"]}
        breadcrumb={["Dashboard", "Registration"]}
        extraToolbarActions={toolbarActions}
        onRefresh={() => getPatients()}
        exportFileName="Patient_Records_Export"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Link to={`/dashboard/patient-profile/${row.id}`}>
              <div className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-400 transition-colors">
                <FiEye size={14}/>
              </div>
            </Link>
            <button 
              onClick={() => setEditPatient(row)} 
              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md text-blue-500 transition-colors"
            >
              <FiEdit size={14}/>
            </button>
            <button 
              onClick={() => { setPrintPatient(row); setTimeout(handlePrint, 50); }} 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 transition-colors"
            >
              <PiPrinterLight size={16}/>
            </button>
            <button 
              onClick={() => { setSelectedPatient(row); setIsDeleteOpen(true); }} 
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md text-red-500 transition-colors"
            >
              <FiTrash2 size={14}/>
            </button>
          </div>
        )}
      />

      {/* Hidden container for printing */}
      <div className="hidden">
        <PatientIDCard ref={printRef} patient={printPatient} />
      </div>

      {/* Logic-specific Modals */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Patient Registration">
        <AddPatients />
      </Modal>

      <AnimatePresence>
        {isDeleteOpen && (
          <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Record">
             <div className="p-4">
                <p className="text-sm opacity-70 mb-6">
                  Are you sure you want to permanently delete <span className="font-bold">{selectedPatient?.firstName} {selectedPatient?.lastName}</span>?
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm rounded-lg border dark:border-gray-600">Cancel</button>
                  <button onClick={() => { deletePatient(selectedPatient.id); setIsDeleteOpen(false); }} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold">Delete Patient</button>
                </div>
             </div>
          </Modal>
        )}
      </AnimatePresence>

      {editPatient && (
        <Modal isOpen={!!editPatient} onClose={() => setEditPatient(null)} title="Modify Patient Information" size="lg">
           <EditPatientModal
              patient={editPatient}
              onClose={() => setEditPatient(null)}
              onSave={async (updatedData) => {
                await updatePatient(updatedData.id, updatedData);
                getPatients();
                setEditPatient(null);
              }}
            />
        </Modal>
      )}
    </div>
  );
};

export default Patients;
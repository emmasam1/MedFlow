import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast, Slide } from "react-toastify";
import Modal from "./Modal";
import { useAppStore } from "../store/useAppStore";

const CreateQueue = ({ onSuccess }) => {
  const { patients, getUsers, createQueue, createNotification } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = useAppStore((s) => s.users) || [];

  useEffect(() => {
    getUsers();
  }, []);

  const scannerRef = useRef(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    );
    audio.play();
  };

  const extractPatientId = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      return parsed.cardNumber?.trim() || null;
    } catch {
      const [cardNumber] = decodedText.split("|");
      return cardNumber?.trim();
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    department: "",
    priority: "Normal",
    reason: "",
    notes: "",
  });

  /* ---------------- SEARCH ---------------- */

  const filteredPatients = (patients || []).filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);

    setFormData((prev) => ({
      ...prev,
      fullName: patient.fullName,
      cardNumber: patient.cardNumber,
    }));

    setSearch(patient.fullName);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setSearch("");

    setFormData({
      fullName: "",
      cardNumber: "",
      department: "",
      priority: "Normal",
      reason: "",
      notes: "",
    });
  };

  /* ---------------- QR SCANNER ---------------- */

  const startScanner = async () => {
    if (isScanning) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;
    setIsScanning(true);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 150, height: 150 } },
        (decodedText) => {
          if (scanSuccess) return;
          const cardNumber = extractPatientId(decodedText);
          handleScanSuccess(cardNumber);
        },
      );
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.warn(err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleScanSuccess = async (cardNumberFromQR) => {
    const normalizedQR = (cardNumberFromQR || "").trim().toLowerCase();

    const found = patients.find(
      (p) => (p.cardNumber || "").trim().toLowerCase() === normalizedQR,
    );

    if (!found) {
      toast.error("Patient not found");
      return;
    }

    playBeep();
    setScanSuccess(true);
    handleSelectPatient(found);

    setTimeout(async () => {
      await stopScanner();
      setIsScanOpen(false);
      setScanSuccess(false);
    }, 1200);
  };

  useEffect(() => {
    let timeoutId;

    if (isScanOpen) {
      timeoutId = setTimeout(() => {
        startScanner();
      }, 300);
    } else {
      stopScanner();
    }

    return () => {
      clearTimeout(timeoutId);
      stopScanner();
    };
  }, [isScanOpen]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.cardNumber) {
    toast.error("Select patient");
    return;
  }

  try {
    setIsSubmitting(true);

    const newQueue = {
      patientId: selectedPatient.id,
      patientName: formData.fullName,
      reason: formData.reason,
      priority: formData.priority,
      notes: formData.notes,
    };

    await createQueue(newQueue);

    toast.success("Patient added to queue");

    clearPatient();
    onSuccess?.();

  } catch (err) {
    console.error(err);
    toast.error("Failed to create queue");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="space-y-6">
      <ToastContainer
        transition={Slide}
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Scan card */}
      <div className="flex justify-end">
        {!selectedPatient ? (
          <div
            onClick={() => setIsScanOpen(true)}
            className="h-32 w-32 bg-red-100 border-2 border-dashed border-red-400 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <p className="text-xs text-red-600 font-semibold text-center">
              Scan Patient Card
            </p>
          </div>
        ) : (
          <div className="h-32 w-32 overflow-hidden">
            <img
              src={`https://i.pravatar.cc/150?u=${selectedPatient.fullName}`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <label className="block text-sm mb-2">Search Patient</label>

        <input
          type="text"
          value={search}
          disabled={selectedPatient}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient..."
          className="w-full px-3 py-2 border rounded-lg border-gray-300"
        />

        {selectedPatient && (
          <button
            type="button"
            onClick={clearPatient}
            className="absolute right-3 top-10 text-gray-500 hover:text-red-500"
          >
            <AiOutlineClose size={18} />
          </button>
        )}

        {search && !selectedPatient && (
          <div className="absolute z-20 w-full border rounded-lg bg-white max-h-60 overflow-y-auto shadow">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="p-3 cursor-pointer hover:bg-gray-100"
                >
                  <p className="font-medium">{p.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {p.cardNumber} • {p.phone}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-gray-500">No patient found</p>
            )}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          value={formData.cardNumber}
          readOnly
          placeholder="Card Number"
          className="px-3 py-2 border rounded-lg border-gray-300"
        />

        {/* <select
          value={formData.doctorId}
          onChange={(e) => {
            const selectedDoc = doctors.find((d) => d.id === e.target.value);

            setFormData({
              ...formData,
              doctorId: selectedDoc?.id,
              doctor: selectedDoc?.name,
              department: selectedDoc?.department,
            });
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option>Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select> */}

        {/* <input
          value={formData.department}
          readOnly
          className="px-3 py-2 border rounded-lg"
        /> */}

        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          className="px-3 py-2 border rounded-lg border-gray-300"
        >
          <option>Normal</option>
          <option>Urgent</option>
          <option>Emergency</option>
        </select>

        <textarea
          rows="3"
          placeholder="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="md:col-span-2 px-3 py-2 border rounded-lg resize-none border-gray-300"
        />

        <textarea
          rows="2"
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="md:col-span-2 px-3 py-2 border rounded-lg resize-none border-gray-300"
        />

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white py-2 px-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Adding..." : "Add To Queue"}
          </button>
        </div>
      </form>

      {/* QR Modal */}
      <Modal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        title="Scan Patient Card"
      >
        <div className="relative">
          <div id="qr-reader" />

          {scanSuccess && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
              <FaCheckCircle size={80} className="text-white" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CreateQueue;

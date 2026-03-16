import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAppStore } from "../store/useAppStore";
import Modal from "./Modal";
import { Html5Qrcode } from "html5-qrcode";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast, Slide } from "react-toastify";

const DoctorsAppointment = ({ onSuccess }) => {
  const { patients, createAppointment, getUsers, createNotification } =
    useAppStore();
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = useAppStore((s) => s.users) || [];

  useEffect(() => {
    getUsers();
  }, []);

  const doctors = users.filter((user) => user.role === "specialist");

  // console.log(doctors)

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
      // If JSON QR
      const parsed = JSON.parse(decodedText);
      return parsed.cardNumber?.trim() || null;
    } catch {
      // If plain format: cardNumber|name
      const [cardNumber] = decodedText.split("|");
      return cardNumber?.trim();
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    doctorId: "", // ✅ add this
    doctor: "",
    department: "",
    date: "",
    time: "",
    priority: "Normal",
    reason: "",
    notes: "", // also add this since you use it later
  });

  /* -------------------- SEARCH -------------------- */

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

    setSearch(patient.fullName); // show inside input
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setSearch("");
    setFormData({
      fullName: "",
      cardNumber: "",
      doctorId: "", // ✅ add
      doctor: "",
      department: "",
      date: "",
      time: "",
      priority: "Normal",
      reason: "",
      notes: "",
    });
  };

  /* -------------------- QR SCANNER -------------------- */
  const startScanner = async () => {
    if (isScanning) return;

    // Use the ID directly to ensure the element exists
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
      console.error("Camera error:", err);
      setIsScanning(false); // Reset if it fails to start
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        // Ensure the scanner is completely cleared from the DOM
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.warn("Stop error:", err);
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
      alert("Patient not found in system");
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

  // This Effect ensures the scanner only runs when the Modal is fully rendered
  useEffect(() => {
    let timeoutId;

    if (isScanOpen) {
      // Small delay ensures the 'qr-reader' div is painted in the DOM
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

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cardNumber) {
      toast.error("Please select a patient");
      return;
    }

    if (!formData.doctorId) {
      toast.error("Please select a doctor");
      return;
    }

    try {
      setIsSubmitting(true); // ✅ start loader

      const newAppointment = {
        cardNumber: formData.cardNumber,
        patientName: formData.fullName,
        doctorId: formData.doctorId,
        assignedDoctor: formData.doctor,
        department: formData.department,
        date: formData.date,
        time: formData.time,
        priority: formData.priority,
        reason: formData.reason,
        notes: formData.notes,
        status: "scheduled",
      };

      // 1️⃣ Create appointment
      await createAppointment(newAppointment);

      // 2️⃣ Send doctor notification
      // await createNotification({
      //   userId: formData.doctorId,
      //   title: "New Appointment",
      //   message: `New appointment scheduled for ${formData.date} at ${formData.time}. Reason: ${formData.reason}`,
      // });

      // toast.success("Appointment created successfully!");

      // 3️⃣ Reset form
      setFormData({
        fullName: "",
        cardNumber: "",
        doctorId: "",
        doctor: "",
        department: "",
        date: "",
        time: "",
        priority: "Normal",
        reason: "",
        notes: "",
      });

      setSelectedPatient(null);
      setSearch("");

      // 4️⃣ close modal
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create appointment");
    } finally {
      setIsSubmitting(false); // ✅ stop loader
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
      <div className="flex justify-end">
        {!selectedPatient ? (
          /* ---------------- SHOW SCAN AREA ---------------- */
          <div
            onClick={() => setIsScanOpen(true)}
            className="h-32 w-32 bg-red-100 border-2 border-dashed border-red-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-200 transition"
          >
            <p className="text-xs text-center text-red-600 font-semibold px-2">
              Click to Scan Patient Card
            </p>
          </div>
        ) : (
          /* ---------------- SHOW PATIENT IMAGE ---------------- */
          <div className="h-32 w-32 overflow-hidden">
            <img
              src={`https://i.pravatar.cc/150?u=${selectedPatient.fullName}`}
              alt="patient"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* ---------------- SEARCH ---------------- */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">Search Patient</label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            disabled={selectedPatient}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg capitalize"
          />

          {selectedPatient && (
            <button
              type="button"
              onClick={clearPatient}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-red-500"
            >
              <AiOutlineClose size={18} />
            </button>
          )}
        </div>

        {search && !selectedPatient && (
          <div
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
  bg-white text-black 
  dark:bg-gray-800 dark:text-white dark:border-gray-600
  focus:ring-1 outline-none"
          >
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="px-4 py-3 cursor-pointer"
                >
                  <p className="font-medium capitalize">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {patient.cardNumber} • {patient.phone}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-gray-500">No patient found</p>
            )}
          </div>
        )}
      </div>

      {/* ---------------- FORM ---------------- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="text"
            value={formData.cardNumber}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Select Doctor
          </label>

          <select
            value={formData.doctorId}
            onChange={(e) => {
              const selectedDoc = doctors.find(
                (doc) => doc.id === e.target.value,
              );

              setFormData({
                ...formData,
                doctorId: selectedDoc?.id,
                doctor: selectedDoc?.name,
                department: selectedDoc?.department || "",
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
  bg-white text-black 
  dark:bg-gray-800 dark:text-white dark:border-gray-600
  focus:ring-1 outline-none"
            required
          >
            <option value="">Choose Doctor</option>

            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            value={formData.department}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Appointment Date
          </label>
          <input
            type="date"
            min={today} // 🔥 prevents selecting past date
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Appointment Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
  bg-white text-black 
  dark:bg-gray-800 dark:text-white dark:border-gray-600
  focus:ring-1 outline-none"
          >
            <option>Normal</option>
            <option>Urgent</option>
            <option>Emergency</option>
          </select>
        </div>

        {/* Reason */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Reason for Visit
          </label>
          <textarea
            rows="3"
            name="reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            required
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Additional Notes
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
        </div>

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
            {isSubmitting ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </form>

      {/* ---------------- QR MODAL ---------------- */}
      <Modal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        title="Scan Patient QR Code"
        size="md"
      >
        <div className="relative">
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />

          {scanSuccess && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center animate-pulse">
              <FaCheckCircle size={80} className="text-white" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorsAppointment;

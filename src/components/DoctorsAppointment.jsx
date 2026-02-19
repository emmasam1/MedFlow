import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";
import Modal from "./Modal";
import { Html5Qrcode } from "html5-qrcode";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

const doctors = [
  { id: 1, name: "Dr. John Smith", department: "Cardiology" },
  { id: 2, name: "Dr. Sarah Johnson", department: "Neurology" },
  { id: 3, name: "Dr. Michael Brown", department: "Pediatrics" },
];

const DoctorsAppointment = () => {
  const { patients } = useStore();
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isScanOpen, setIsScanOpen] = useState(false);

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
      return parsed.patientId || null;
    } catch {
      return decodedText; // plain string QR
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    patientId: "",
    doctor: "",
    department: "",
    date: "",
    time: "",
    priority: "Normal",
    reason: "",
  });

  /* -------------------- SEARCH -------------------- */

  const filteredPatients = patients.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);

    setFormData((prev) => ({
      ...prev,
      fullName: patient.fullName,
      patientId: patient.patientId,
    }));

    setSearch(patient.fullName); // show inside input
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setSearch("");
    setFormData({
      fullName: "",
      patientId: "",
      doctor: "",
      department: "",
      date: "",
      time: "",
      priority: "Normal",
      reason: "",
    });
  };

  /* -------------------- QR SCANNER -------------------- */
  const startScanner = async () => {
    if (isScanning) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;
    setIsScanning(true);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (scanSuccess) return; // prevent double scan

          const patientId = extractPatientId(decodedText);
          handleScanSuccess(patientId);
        },
      );
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    }
  };

  const handleScanSuccess = async (patientIdFromQR) => {
    const found = patients.find((p) => p.patientId === patientIdFromQR);

    if (!found) {
      alert("Patient not found in system");
      return;
    }

    playBeep(); // 🔊 sound
    setScanSuccess(true); // show animation

    handleSelectPatient(found);

    setTimeout(async () => {
      await stopScanner();
      setIsScanOpen(false);
      setScanSuccess(false);
    }, 1200);
  };

  useEffect(() => {
    if (isScanOpen) {
      startScanner();
    } else {
      stopScanner();
    }
  }, [isScanOpen]);

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }

    console.log("Appointment:", formData);
    alert("Appointment created successfully!");
  };

  return (
    <div className="space-y-6">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
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
          <div className="absolute w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-2 max-h-52 overflow-y-auto z-20">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                >
                  <p className="font-medium">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {patient.patientId} • {patient.phone}
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
          <label className="block text-sm font-medium mb-1">Patient ID</label>
          <input
            type="text"
            value={formData.patientId}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Select Doctor
          </label>
          <select
            value={formData.doctor}
            onChange={(e) => {
              const selectedDoc = doctors.find(
                (doc) => doc.name === e.target.value,
              );
              setFormData({
                ...formData,
                doctor: e.target.value,
                department: selectedDoc?.department || "",
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Choose Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} - {doc.department}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            className="bg-blue-600 text-white py-2 px-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Create Appointment
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



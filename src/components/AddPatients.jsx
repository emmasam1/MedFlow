import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCameraLensLine,
  RiUser3Line,
  RiCloseLine,
  RiCheckLine,
  RiImageAddLine,
} from "react-icons/ri";
import { useAppStore } from "../store/useAppStore";
import { ToastContainer, toast, Bounce } from "react-toastify";

const generateCardNumber = (type) => {
  const prefixes = {
    single: "SGL",
    family: "FAM",
    nhis: "NHIS",
    kachma: "KCH",
  };

  const prefix = prefixes[type] || "GEN";

  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

const AddPatients = ({ onSuccess }) => {
  const { darkMode, registerPatient } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    gender: "",
    type: "",
    // cardNumber: "",
    status: "",
    registrationType: "",
    insuranceNumber: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    occupation: "",
    nokName: "",
    nokRelationship: "",
    nokPhone: "",
    nokAddress: "",
  });

  // Load saved data from localStorage if any
  useEffect(() => {
    const saved = localStorage.getItem("patientFormData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem("patientFormData", JSON.stringify(formData));
  }, [formData]);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // FIX: Force a smaller size (e.g., 400px width) instead of the full video resolution
    const scale = 400 / video.videoWidth;
    canvas.width = 400;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext("2d");

    // Optional: Flip the image horizontally so it's not mirrored
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use 0.4 quality. This will make the file roughly 30KB - 50KB
    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.4);
    setPhoto(compressedBase64);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const patientTypes = ["SINGLE", "FAMILY", "NHIS", "KACHMA"];

  const relationshipTypes = [
    "Spouse",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Son",
    "Daughter",
    "Guardian",
  ];

  const getStatus = (type) => {
    const statuses = {
      single: "Private",
      family: "Regular",
      nhis: "Insurance",
      kachma: "Insurance",
    };

    return statuses[type] || "Regular";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        cardNumber: generateCardNumber(value),
        status: getStatus(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const inputClass = `w-full px-3 py-1.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 
    ${
      darkMode
        ? "bg-[#111827] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-600"
    }`;

  const labelClass = `block text-[10px] font-bold uppercase tracking-widest mb-1 ${
    darkMode ? "text-gray-400" : "text-gray-500"
  }`;

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("Please fill required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const newPatient = {
        // pid: Date.now(),
        // patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dob,
        phoneNumber: formData.phone,
        email: formData.email,
        address: formData.address,
        // bloodGroup: "N/A",
        registrationType: formData.registrationType,
        // cardNumber: formData.cardNumber,
        // status: "Active",
        photo: photo || "",
        maritalStatus: formData.maritalStatus,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
        occupation: formData.occupation,
        nextOfKin: {
          name: formData.nokName,
          relationship: formData.nokRelationship,
          phone: formData.nokPhone,
          address: formData.nokAddress,
        },
        regDate: new Date().toISOString().split("T")[0],
      };

      await registerPatient(newPatient);

      toast.success("Patient registered successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        registrationType: "",
        cardNumber: "",
        status: "",
        insuranceNumber: "",
        maritalStatus: "",
        stateOfOrigin: "",
        lga: "",
        occupation: "",
        nokName: "",
        nokRelationship: "",
        nokPhone: "",
        nokAddress: "",
      });

      setPhoto(null);
      setCurrentStep(1);

      // Clear saved data
      localStorage.removeItem("patientFormData");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to register patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-h-[85vh]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {/* Progress Bar - More Compact */}
      <div className="flex items-center justify-between mb-4 max-w-xs mx-auto">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex items-center ${step === 3 ? "" : "flex-1"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
              ${currentStep >= step ? "bg-blue-600 border-blue-600 text-white" : darkMode ? "bg-gray-800 border-gray-700 text-gray-600" : "bg-gray-100 border-gray-200 text-gray-400"}`}
            >
              {currentStep > step ? <RiCheckLine size={14} /> : step}
            </div>
            {step < 3 && (
              <div
                className={`h-[1px] flex-1 mx-2 ${currentStep > step ? "bg-blue-600" : darkMode ? "bg-gray-800" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-x-4 gap-y-3"
            >
              {/* Photo Section */}
              <div className="col-span-1 flex flex-col items-center">
                <div
                  className={`w-full aspect-square max-w-[120px] rounded-xl overflow-hidden border-2 flex items-center justify-center relative
                  ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-200"}`}
                >
                  {isCameraOpen ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : photo ? (
                    <img
                      src={photo}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <RiUser3Line size={32} className="text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col w-full gap-1.5 mt-2 max-w-[120px]">
                  {!isCameraOpen ? (
                    <>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="text-[9px] font-bold uppercase bg-blue-600 text-white py-1.5 rounded flex items-center justify-center gap-1"
                      >
                        <RiCameraLensLine /> Capture
                      </button>
                      <label className="text-[9px] font-bold uppercase bg-gray-500 text-white py-1.5 rounded cursor-pointer flex items-center justify-center gap-1">
                        <RiImageAddLine /> Upload{" "}
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </label>
                    </>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 text-[9px] font-bold uppercase bg-green-600 text-white py-1.5 rounded"
                      >
                        Snap
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-red-600 text-white p-1.5 rounded"
                      >
                        <RiCloseLine size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Inputs */}
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Registration Type</label>
                  <select
                    name="registrationType"
                    value={formData.registrationType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Select</option>
                    {patientTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Card Number & Status directly under Gender & Type */}
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                     onChange={handleChange}
                    className={`${inputClass} opacity-60 bg-transparent`}
                    // disabled
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                 <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Select Blood Group</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">A+</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB+</option>
                    <option value="AB-">AB-</option>
                                   
                  </select>
                </div>

                {/* Insurance Number (optional) */}
                {/* {formData.tyregistrationTypepe === "nhis" && (
                  <div className="col-span-2">
                    <label className={labelClass}>Insurance #</label>
                    <input
                      name="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )} */}
              </div>

              <div className="col-span-3 flex justify-end mt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 text-white px-5 py-1.5 rounded-lg text-sm font-bold"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className={labelClass}>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Origin State</label>
                <input
                  name="stateOfOrigin"
                  value={formData.stateOfOrigin}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>LGA</label>
                <input
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="col-span-full">
                <label className={labelClass}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClass} h-16 resize-none`}
                />
              </div>
              <div className="col-span-full flex justify-between mt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 text-white px-5 py-1.5 rounded-lg text-sm font-bold"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="col-span-full border-b dark:border-gray-800 pb-1 mb-1">
                <h3 className="text-[10px] font-bold uppercase text-blue-500">
                  Next of Kin
                </h3>
              </div>
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="nokName"
                  value={formData.nokName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Relationship</label>
                <select
                  name="nokRelationship"
                  value={formData.nokRelationship}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Relationship</option>
                  {relationshipTypes.map((rel) => (
                    <option key={rel} value={rel.toLowerCase()}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  name="nokPhone"
                  value={formData.nokPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  name="nokAddress"
                  value={formData.nokAddress}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="col-span-full flex justify-between mt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`bg-blue-600 text-white py-1 px-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700 transition ${isSubmitting ? "opacity-70 cursor-not-allowed px-5 flex gap-2 items-center" : ""}`}
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
                  {isSubmitting ? "Finishing..." : "Finish Registration"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default AddPatients;

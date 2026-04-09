import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { motion } from "framer-motion";
import {
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { MdFamilyRestroom } from "react-icons/md";
import { RiHeartPulseLine } from "react-icons/ri";
import { useStore } from "../../store/store";
import { RiUserHeartLine } from "react-icons/ri";
import { useAppStore } from "../../store/useAppStore";
import VitalsTabs from "../../components/VitalsTabs";

const Row = ({ label, value, darkMode }) => (
  <div className="grid grid-cols-2 items-center">
    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
      {label}
    </span>
    <span
      className={
        darkMode ? "text-gray-100 font-medium" : "text-gray-800 font-medium"
      }
    >
      {value}
    </span>
  </div>
);

const Section = ({ loading, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: loading ? 0 : 1, y: loading ? 10 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading ? <Skeleton active paragraph={{ rows: 6 }} /> : children}
    </motion.div>
  );
};

const PatientProfile = () => {
  const { darkMode } = useStore();
  const { patient, loading, fetchSinglePatient } = useAppStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchSinglePatient(id);
  }, [id, fetchSinglePatient]);

  const balance = Number(patient?.runningBalance ?? 0);



  let statusText = "";
  let statusColor = "";
  const amountDisplay = Math.abs(balance).toLocaleString();

  if (balance > 0) {
    statusText = "Advance Payment";
    statusColor = "text-green-600 bg-green-50 border-green-200";
  } else if (balance < 0) {
    statusText = "Outstanding Payment";
    statusColor = "text-red-600 bg-red-50 border-red-200";
  } else {
    statusText = "No Outstanding Balance";
    statusColor = "text-gray-600 bg-gray-50 border-gray-200";
  }

  // Loading states for sections
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [loadingMedical, setLoadingMedical] = useState(true);
  const [loadingAdmission, setLoadingAdmission] = useState(true);
  const [loadingInsurance, setLoadingInsurance] = useState(true);
  const [loadingVisitHistory, setLoadingVisitHistory] = useState(true);

  useEffect(() => {
    if (!patient) return;
    const delay = 100;
    setTimeout(() => setLoadingProfile(false), 0);
    setTimeout(() => setLoadingPersonal(false), delay);
    setTimeout(() => setLoadingContact(false), delay * 2);
    setTimeout(() => setLoadingMedical(false), delay * 3);
    setTimeout(() => setLoadingAdmission(false), delay * 4);
    setTimeout(() => setLoadingInsurance(false), delay * 5);
    setTimeout(() => setLoadingVisitHistory(false), delay * 6);
  }, [patient]);

  if (loading) return <div className="p-6">Loading patient...</div>;
  if (!patient)
    return (
      <div className="p-6 text-gray-500">
        Patient not found or does not exist.
      </div>
    );

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age;
  };

  const panelClass = `rounded-sm shadow-sm ${darkMode ? "bg-gray-800 text-gray-100 border border-gray-700" : "bg-white text-gray-900"}`;
  const panelHeaderClass = `flex items-center gap-2 px-5 py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"} font-semibold`;
  const textClass = darkMode ? "text-gray-100" : "text-gray-800";

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-gray-100 min-h-screen"
          : "bg-gray-50 text-gray-900 min-h-screen"
      }
    >
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-4">
        <div
          className={`flex items-center text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          <Link to="/dashboard/patients" className="flex gap-2 items-center">
            <RiUserHeartLine className="w-4 h-4" /> All Patients
          </Link>
          <span className="mx-2">›</span>
          <span className="font-semibold capitalize">
            {patient.fullName} information
          </span>
        </div>
        <div
          className={`flex justify-between items-center gap-3 bg-transparent ${statusColor}`}
        >
          <p
            className={`text-sm font-bold ${darkMode ? "text-gray-200" : "text-black"}`}
          >
            Running Balance
          </p>
          <h2 className="font-bold flex items-center gap-3">
            {balance === 0 ? "₦0.00" : (balance < 0 ? "−" : "") + amountDisplay}
            <span className="text-xs">{statusText}</span>
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* LEFT SIDE */}
        <div className="md:w-1/3 space-y-5">
          {/* PROFILE HEADER */}
          <Section loading={loadingProfile}>
            <div className={`${panelClass} p-6 text-center`}>
              <img
                src={`https://i.pravatar.cc/150?u=${patient.fullName}`}
                alt="patient"
                className="w-28 h-28 mx-auto rounded-full border-4 border-blue-400 object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold capitalize">
                {patient.fullName}
              </h2>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
              >
                Card Number: {patient.cardNumber}
              </p>
              <button
                className={`mt-3 px-4 py-1.5 rounded-md text-sm font-medium border ${darkMode ? "border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500" : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"}`}
              >
                {patient.status}
              </button>
            </div>
          </Section>

          {/* PERSONAL INFORMATION */}
          <Section loading={loadingPersonal}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                Personal Information
              </div>
              <div className="p-5 space-y-4 text-sm capitalize">
                <Row
                  label="Full Name"
                  value={patient.fullName}
                  darkMode={darkMode}
                />
                <Row
                  label="Gender"
                  value={patient.gender}
                  darkMode={darkMode}
                />
                <Row
                  label="Age"
                  value={`${calculateAge(patient.dob)} years`}
                  darkMode={darkMode}
                />
                <Row
                  label="Date of Birth"
                  value={patient.dob}
                  darkMode={darkMode}
                />
                <Row
                  label="Marital Status"
                  value={patient.maritalStatus || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="National ID"
                  value={patient.personalInfo?.nationalId || "—"}
                  darkMode={darkMode}
                />
              </div>

              {patient.familyMembers && patient.familyMembers.length > 0 && (
                <div className="">
                  {/* Header */}
                  <div
                    className={`flex items-center gap-2 px-5 py-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200"} border-b ${darkMode ? "border-gray-600" : "border-gray-200"}  font-semibold`}
                    // style={{ borderTop: "1px solid gray" }}
                  >
                    <MdFamilyRestroom className="w-5 h-5 text-gray-400" />
                    Family Members
                  </div>

                  {/* Family Members Grid */}
                  <div>
                    {patient.familyMembers.map((member, i) => (
                      <div
                        className="flex justify-between items-center mt-4 px-5 pb-4"
                        key={i}
                      >
                        <h3
                          className={`font-medium capitalize ${darkMode ? "text-gray-100" : "text-gray-900"}`}
                        >
                          {member.name || "N/A"}
                        </h3>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {member.relationship || "Relationship not specified"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* CONTACT & ADDRESS */}
          <Section loading={loadingContact}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <IdentificationIcon className="w-5 h-5 text-gray-400" />
                Contact & Address
              </div>
              <div className="p-5 space-y-4 text-sm capitalize">
                <Row label="Phone" value={patient.phone} darkMode={darkMode} />
                <Row
                  label="Address"
                  value={patient.address}
                  darkMode={darkMode}
                />
                <p
                  className={`font-semibold pt-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Emergency Contact
                </p>
                <Row
                  label="Name"
                  value={patient.nextOfKin?.name || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Relation"
                  value={patient.nextOfKin?.relationship || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Phone"
                  value={patient.nextOfKin?.phone || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Address"
                  value={patient.nextOfKin?.address || "—"}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-2/3 space-y-4">
          {/* MEDICAL INFORMATION */}
          <Section loading={loadingMedical}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <PlusCircleIcon className="w-5 h-5" />
                Medical Information
              </div>
              <div className="p-5 space-y-4 text-sm">
                <Row
                  label="Blood Group"
                  value={patient.bloodGroup}
                  darkMode={darkMode}
                />
                <Row
                  label="Allergies"
                  value={
                    <div className="flex gap-2">
                      {patient.medicalInfo?.allergies.map((a, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 border rounded-md text-xs"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  }
                />
                <Row
                  label="Chronic Conditions"
                  value={
                    <div className="flex gap-2">
                      {patient.medicalInfo?.chronicConditions.map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 border rounded-md text-xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  }
                />
                <Row
                  label="Current Medications"
                  value={
                    <div className="space-y-1">
                      {patient.medicalInfo?.currentMedications.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <PlusCircleIcon className="w-4 h-4 text-blue-500" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  }
                />
                <Row
                  label="Past Medical History"
                  value={patient.medicalInfo?.pastMedicalHistory}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </Section>

          <Section loading={loadingAdmission}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <RiHeartPulseLine className="w-5 h-5" />
                Vitals
              </div>

              <VitalsTabs patient={patient} darkMode={darkMode} />
            </div>
          </Section>

          {/* ADMISSION DETAILS */}
          <Section loading={loadingAdmission}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Admission Details
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Admission Date"
                  value={patient.admissionDetails?.admissionDate || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Discharge Date"
                  value={patient.admissionDetails?.dischargeDate || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Doctor Assigned"
                  value={patient.admissionDetails?.doctorAssigned || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Ward/Room"
                  value={patient.admissionDetails?.ward || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Reason for Admission"
                  value={patient.admissionDetails?.reason || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Treatment"
                  value={patient.admissionDetails?.treatment || "—"}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </Section>

          {/* INSURANCE DETAILS */}
          <Section loading={loadingInsurance}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <ShieldCheckIcon className="w-5 h-5" />
                Insurance Details
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Insurance Provider"
                  value={patient.insuranceDetails?.provider || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Policy Number"
                  value={patient.insuranceDetails?.policyNumber || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Policy Type"
                  value={patient.insuranceDetails?.policyType || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Coverage Period"
                  value={patient.insuranceDetails?.coveragePeriod || "—"}
                  darkMode={darkMode}
                />
                <Row
                  label="Coverage Amount"
                  value={`₦${patient.insuranceDetails?.coverageAmount.toLocaleString() || "—"}`}
                  darkMode={darkMode}
                />
                <Row
                  label="Copayment"
                  value={patient.insuranceDetails?.copayment || "—"}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </Section>

          {/* VISIT HISTORY */}
          <Section loading={loadingVisitHistory}>
            <div className={panelClass}>
              <div className={panelHeaderClass}>
                <ClockIcon className="w-5 h-5" />
                Visit History
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead
                    className={`${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-600"}`}
                  >
                    <tr>
                      <th className="text-left px-5 py-3">Date</th>
                      <th className="text-left px-5 py-3">Doctor</th>
                      <th className="text-left px-5 py-3">Treatment</th>
                      <th className="text-left px-5 py-3">Charges (₦)</th>
                      <th className="text-left px-5 py-3">Outcome</th>
                      <th className="text-right px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.visitHistory?.map((visit, i) => (
                      <tr
                        key={i}
                        className={`${darkMode ? "border-gray-600 hover:bg-gray-600" : "border-t border-gray-200 hover:bg-gray-50"} text-xs`}
                      >
                        <td className="px-5 py-3">{visit.date}</td>
                        <td className="px-5 py-3">{visit.doctor}</td>
                        <td className="px-5 py-3">{visit.treatment}</td>
                        <td className="px-5 py-3">{visit.charges}</td>
                        <td className="px-5 py-3">{visit.outcome}</td>
                        <td className="px-5 py-3 text-right flex justify-end gap-3">
                          <EyeIcon className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                          <PencilSquareIcon className="w-5 h-5 text-gray-400 hover:text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
          
          {/* LAB HISTORY */}
          <Section loading={loadingVisitHistory}>
            <div className={panelClass}>
              <div className="panelHeaderClass">
                <RiHeartPulseLine className="w-5 h-5" />
                Lab Result
              </div>

              <div className="p-5 space-y-4">
                {patient.labhistory && patient.labhistory.length>0?(
                  patient.labHistory.map((lab, i)=> (
                    <div key={lab.id || i} className={`border rounded-lg p-4 ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                      {/* HEADER */}

                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-sm">
                          Lab Session #{i + 1}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(lab.date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* REQUESTED BY */}
                      <p>
                        Requested by:{lab.requestedBy || "_"}
                      </p>

                      {/* TESTS */}
                      <div className="space-y-2">
                        {lab.tests?.map((test, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{test.name}</span>
                            <span className="font-medium">{test.result || "_"}</span>
                          </div>
                        ))}
                      </div>

                      {/* NOTES */}
                      {lab.notes && (
                        <p className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Notes:</span>{lab.notes}
                        </p>
                      )}

                      {/* FILE */}
                      {lab.file && (
                        <div className="mt-2">
                          <button className="text-blue-500 text-xs underline">
                            View Report({lab.file})
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                  
                ):(
                  <p className="text-sm text-gray-400">
                    No Lab Result Available
                  </p>
                )}

              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

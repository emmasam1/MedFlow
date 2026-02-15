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
import { useStore } from "../../store/store";
import { RiUserHeartLine } from "react-icons/ri";

const Row = ({ label, value }) => (
  <div className="grid grid-cols-2 items-center">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
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
  const { id } = useParams();
  const patients = useStore((state) => state.patients);

  const patient = patients.find((p) => String(p.id) === String(id));

  
  const balance = Number(patient?.runningBalance ?? 0);
  
  let statusText = "";
  let statusColor = "";
  let amountDisplay = `₦${Math.abs(balance).toLocaleString()}`;

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

  // Separate loading states for each box
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [loadingMedical, setLoadingMedical] = useState(true);
  const [loadingAdmission, setLoadingAdmission] = useState(true);
  const [loadingInsurance, setLoadingInsurance] = useState(true);
  const [loadingVisitHistory, setLoadingVisitHistory] = useState(true);

  useEffect(() => {
    if (!patient) return;

    const delay = 100; // shorter delay between boxes

    setTimeout(() => setLoadingProfile(false), 0);
    setTimeout(() => setLoadingPersonal(false), delay);
    setTimeout(() => setLoadingContact(false), delay * 2);
    setTimeout(() => setLoadingMedical(false), delay * 3);
    setTimeout(() => setLoadingAdmission(false), delay * 4);
    setTimeout(() => setLoadingInsurance(false), delay * 5);
    setTimeout(() => setLoadingVisitHistory(false), delay * 6);
  }, [patient]);

  if (!patient) {
    return (
      <div className="p-6 text-gray-500">
        Patient not found or data not loaded.
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-4!">
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/dashboard/patients" className="flex gap-2 item-center">
            <RiUserHeartLine className="w-4 h-4" /> All Patients
          </Link>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-800">
            {patient.fullName} information
          </span>
        </div>

        <div
          className={`flex justify-between items-center gap-3 bg-transparent! ${statusColor}`}
        >
          <p className="text-sm font-bold text-black">Running Balance</p>

          <h2 className="font-bold m-0! flex items-center gap-3">
            {balance === 0 ? "₦0.00" : (balance < 0 ? "−" : "") + amountDisplay}
            <span className="text-xs">{statusText}</span>
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4!">
        {/* LEFT SIDE */}
        <div className="md:w-1/3 space-y-5">
          {/* PROFILE HEADER */}
          <Section loading={loadingProfile}>
            <div className="bg-white rounded-sm shadow-sm p-6 text-center">
              <img
                src={`https://i.pravatar.cc/150?u=${patient.fullName}`}
                alt="patient"
                className="w-28 h-28 mx-auto rounded-full border-4 border-blue-400 object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {patient.fullName}
              </h2>
              <p className="text-sm text-gray-500">
                Patient ID: {patient.patientId}
              </p>
              <button className="mt-3 px-4 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
                {patient.status}
              </button>
            </div>
          </Section>

          {/* PERSONAL INFORMATION */}
          <Section loading={loadingPersonal}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                <UserCircleIcon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">
                  Personal Information
                </h3>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <Row label="Full Name" value={patient.fullName} />
                <Row label="Gender" value={patient.gender} />
                <Row label="Age" value={`${patient.age} years`} />
                <Row label="Date of Birth" value={patient.dob} />
                <Row
                  label="Marital Status"
                  value={patient.personalInfo.maritalStatus}
                />
                <Row
                  label="National ID"
                  value={patient.personalInfo.nationalId}
                />
              </div>
            </div>
          </Section>

          {/* CONTACT & ADDRESS */}
          <Section loading={loadingContact}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                <IdentificationIcon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">
                  Contact & Address
                </h3>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <Row label="Phone" value={patient.phone} />
                <Row label="Address" value={patient.address} />
                <p className="font-semibold text-gray-700 pt-2">
                  Emergency Contact
                </p>
                <Row label="Name" value={patient.emergencyContact.name} />
                <Row
                  label="Relation"
                  value={patient.emergencyContact.relation}
                />
                <Row label="Phone" value={patient.emergencyContact.phone} />
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-2/3 space-y-4">
          {/* MEDICAL INFORMATION */}
          <Section loading={loadingMedical}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                <PlusCircleIcon className="w-5 h-5" />
                Medical Information
              </div>
              <div className="p-5 space-y-4 text-sm">
                <Row label="Blood Group" value={patient.bloodGroup} />
                <Row
                  label="Allergies"
                  value={
                    <div className="flex gap-2">
                      {patient.medicalInfo.allergies.map((a, i) => (
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
                      {patient.medicalInfo.chronicConditions.map((c, i) => (
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
                      {patient.medicalInfo.currentMedications.map((m, i) => (
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
                  value={patient.medicalInfo.pastMedicalHistory}
                />
              </div>
            </div>
          </Section>

          {/* ADMISSION DETAILS */}
          <Section loading={loadingAdmission}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Admission Details
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Admission Date"
                  value={patient.admissionDetails.admissionDate}
                />
                <Row
                  label="Discharge Date"
                  value={patient.admissionDetails.dischargeDate || "—"}
                />
                <Row
                  label="Doctor Assigned"
                  value={patient.admissionDetails.doctorAssigned}
                />
                <Row label="Ward/Room" value={patient.admissionDetails.ward} />
                <Row
                  label="Reason for Admission"
                  value={patient.admissionDetails.reason}
                />
                <Row
                  label="Treatment"
                  value={patient.admissionDetails.treatment}
                />
              </div>
            </div>
          </Section>

          {/* INSURANCE DETAILS */}
          <Section loading={loadingInsurance}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                <ShieldCheckIcon className="w-5 h-5" />
                Insurance Details
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Insurance Provider"
                  value={patient.insuranceDetails.provider}
                />
                <Row
                  label="Policy Number"
                  value={patient.insuranceDetails.policyNumber}
                />
                <Row
                  label="Policy Type"
                  value={patient.insuranceDetails.policyType}
                />
                <Row
                  label="Coverage Period"
                  value={patient.insuranceDetails.coveragePeriod}
                />
                <Row
                  label="Coverage Amount"
                  value={`₦${patient.insuranceDetails.coverageAmount.toLocaleString()}`}
                />
                <Row
                  label="Copayment"
                  value={patient.insuranceDetails.copayment}
                />
              </div>
            </div>
          </Section>

          {/* VISIT HISTORY */}
          <Section loading={loadingVisitHistory}>
            <div className="bg-white rounded-sm shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                <ClockIcon className="w-5 h-5" />
                Visit History
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
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
                    {patient.visitHistory.map((visit, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 hover:bg-gray-50 text-xs"
                      >
                        <td className="px-5 py-3">{visit.date}</td>
                        <td className="px-5 py-3">{visit.doctor}</td>
                        <td className="px-5 py-3">{visit.treatment}</td>
                        <td className="px-5 py-3">{visit.charges}</td>
                        <td className="px-5 py-3">{visit.outcome}</td>
                        <td className="px-5 py-3 text-right flex justify-end gap-3">
                          <EyeIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                          <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-green-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

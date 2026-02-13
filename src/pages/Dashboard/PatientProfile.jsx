// import React from 'react'
// import { Breadcrumb, Typography, Tabs } from "antd";
// import { TbHomeCheck, TbPhoneCall } from "react-icons/tb";
// import { MdOutlineMarkEmailRead } from "react-icons/md";

// const PatientProfile = () => {
//     return (
//         <div>
//             <div className="flex flex-col md:flex-row gap-4 mt-3">
//                 <div className="md:w-1/3">
//                      left

//                 </div>

//                 <div className="md:w-2/3 bg-white rounded-xl p-6">
//                     right
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PatientProfile

import React from "react";
import { TbPhoneCall, TbHomeCheck } from "react-icons/tb";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useParams } from "react-router-dom";
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


const patient = {
    id: "P001",
    name: "Sarah Smith",
    status: "Discharged",
    gender: "Female",
    age: "35 years",
    dob: "1989-05-15",
    marital: "Married",
    nationalId: "NAT123456789",
    email: "mj@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Main Street, Anytown, CA 91234",

    emergency: {
        name: "John Smith",
        relation: "Husband",
        phone: "+1 (987) 654-3210",
    },

    medical: {
        blood: "A+",
        allergies: ["Penicillin", "Peanuts"],
        conditions: ["Asthma", "Hypertension"],
        medications: ["Albuterol", "Lisinopril"],
        history: "Appendectomy in 2015, Fractured wrist in 2018",
    },

    admission: {
        date: "2023-11-10",
        discharge: "2023-11-15",
        doctor: "Dr. Jacob Ryan",
        ward: "W-103 / R-303",
        reason: "Severe asthma attack",
        treatment: "Respiratory therapy and medication adjustment",
    },

    // ✅ Added Insurance Details
    insurance: {
        provider: "HealthCare Insurance Co.",
        policyNumber: "HC123456789",
        policyType: "Individual",
        coveragePeriod: {
            start: "2024-01-01",
            end: "2025-01-01",
        },
        coverageAmount: 500000,
        copayment: "15%",
    },

    // ✅ Added Visit History
    visitHistory: [
        {
            date: "2023-11-10",
            doctor: "Dr. Jacob Ryan",
            treatment: "Respiratory therapy",
            charges: 250,
            outcome: "Improved",
        },
        {
            date: "2023-08-22",
            doctor: "Dr. Sophia Chen",
            treatment: "Blood pressure check",
            charges: 120,
            outcome: "Stable",
        },
        {
            date: "2023-05-15",
            doctor: "Dr. Jacob Ryan",
            treatment: "Annual physical",
            charges: 180,
            outcome: "Healthy",
        },
    ],
};

///Helper Function for Row
const Row = ({ label, value }) => (
    <div className="grid grid-cols-2 items-center">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-800 font-medium">{value}</span>
    </div>
);


const PatientProfile = () => {
     const { id } = useParams();
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mt-3">

                {/* LEFT SIDE */}
                <div className="md:w-1/3">
                    {/* ================= PROFILE HEADER ================= */}

                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                        <img
                            src="https://i.pravatar.cc/150?u=sarah"
                            alt="patient"
                            className="w-28 h-28 mx-auto rounded-full border-4 border-blue-400 object-cover"
                        />

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            {patient.name}
                        </h2>

                        <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>

                        {/* Status Button */}
                        <button className="
                            mt-3 px-4 py-1.5 rounded-md text-sm font-medium
                            border border-gray-300 text-gray-700
                            hover:bg-gray-100 hover:border-gray-400
                            transition-all duration-200
                            "
                        >
                            {patient.status}
                        </button>
                    </div>

                    {/* ================= PERSONAL INFORMATION ================= */}
                    <div className="bg-white rounded-xl shadow-sm mt-5">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                            <UserCircleIcon className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-800">
                                Personal Information
                            </h3>
                        </div>

                        <div className="p-5 space-y-4 text-sm">
                            <Row label="Full Name" value={patient.name} />
                            <Row label="Gender" value={patient.gender} />
                            <Row label="Age" value={patient.age} />
                            <Row label="Date of Birth" value={patient.dob} />
                            <Row label="Marital Status" value={patient.marital} />
                            <Row label="National ID" value={patient.nationalId} />
                        </div>
                    </div>

                    {/* ================= CONTACT & ADDRESS ================= */}
                    <div className="bg-white rounded-xl shadow-sm mt-5">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                            <IdentificationIcon className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-800">
                                Contact & Address
                            </h3>
                        </div>

                        <div className="p-5 space-y-4 text-sm">
                            <Row label="Email" value={patient.email} />
                            <Row label="Phone" value={patient.phone} />
                            <Row label="Address" value={patient.address} />

                            {/* Emergency Contact Title */}
                            <p className="font-semibold text-gray-700 pt-2">
                                Emergency Contact
                            </p>

                            <Row label="Name" value={patient.emergency.name} />
                            <Row label="Relation" value={patient.emergency.relation} />
                            <Row label="Phone" value={patient.emergency.phone} />
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="md:w-2/3 space-y-4">

                    {/* Medical Information */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                            <PlusCircleIcon className="w-5 h-5" />
                            Medical Information
                        </div>

                        <div className="p-5 space-y-4  text-sm">
                            <Row label="Blood Group" value={<div className="flex justify-start">{patient.medical.blood}</div>}/>

                            <Row label="Allergies"
                                value={
                                    <div className="flex gap-2 justify-start">
                                        {patient.medical.allergies.map((a, i) => (
                                            <span key={i} className="px-3 py-1 border rounded-md text-xs">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                }
                            />

                            <Row label="Chronic Conditions" value={
                                    <div className="flex gap-2 justify-start">
                                        {patient.medical.conditions.map((c, i) => (
                                            <span key={i} className="px-3 py-1 border rounded-md text-xs">
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
                                        {patient.medical.medications.map((m, i) => (
                                            <div key={i} className="flex items-center gap-2 justify-start">
                                                <PlusCircleIcon className="w-4 h-4 text-blue-500" />
                                                <span>{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <Row label="Past Medical History" value={patient.medical.history} />
                        </div>
                    </div>

                    {/* Admission Details */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                            <ClipboardDocumentListIcon className="w-5 h-5" />
                            Admission Details
                        </div>

                        <div className="p-5 space-y-3 text-sm">
                            <Row label="Admission Date" value={patient.admission.date} />
                            <Row label="Discharge Date" value={patient.admission.discharge} />
                            <Row label="Doctor Assigned" value={patient.admission.doctor} />
                            <Row label="Ward/Room" value={patient.admission.ward} />
                            <Row label="Reason for Admission" value={patient.admission.reason} />
                            <Row label="Treatment" value={patient.admission.treatment} />
                        </div>

                    </div>

                    {/* Insurance Details */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 font-semibold text-gray-700">
                            <ShieldCheckIcon className="w-5 h-5" />
                            Insurance Details
                        </div>

                        <div className="p-5 space-y-3 text-sm">
                            <Row label="Insurance Provider" value={patient.insurance.provider} />
                            <Row label="Policy Number" value={patient.insurance.policyNumber} />
                            <Row label="Policy Type" value={patient.insurance.policyType} />
                            <Row
                                label="Coverage Period"
                                value={`${patient.insurance.coveragePeriod.start} - ${patient.insurance.coveragePeriod.end}`}
                            />
                            <Row label="Coverage Amount" value={patient.insurance.coverageAmount} />
                            <Row label="Copayment" value={patient.insurance.copayment} />
                        </div>

                    </div>

                    {/* Visit History */}
                    <div className="bg-white rounded-xl shadow-sm">
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
                                        <th className="text-left px-5 py-3">Charges ($)</th>
                                        <th className="text-left px-5 py-3">Outcome</th>
                                        <th className="text-right px-5 py-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {patient.visitHistory.map((visit, i) => (
                                        <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="px-5 py-3">{visit.date}</td>
                                            <td className="px-5 py-3">{visit.doctor}</td>
                                            <td className="px-5 py-3">{visit.treatment}</td>
                                            <td className="px-5 py-3">{visit.charges}</td>
                                            <td className="px-5 py-3">{visit.outcome}</td>

                                            <td className="px-5 py-3 text-right flex justify-end gap-3">
                                                <button className="text-gray-500 hover:text-blue-600">
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button className="text-gray-500 hover:text-green-600">
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>



            </div>
        </div>
    );
};

export default PatientProfile;



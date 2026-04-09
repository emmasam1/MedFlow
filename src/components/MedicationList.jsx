import React from "react";
import { useStore } from "../store/store";

const MedicationList = () => {
  const { darkMode } = useStore();

  const medications = [
    {
      id: 1,
      patient: "John Doe",
      drug: "Paracetamol 500mg",
      time: "10:00 AM",
      status: "Pending",
      notes: "Take after breakfast",
    },
    {
      id: 2,
      patient: "Jane Smith",
      drug: "Insulin",
      time: "09:00 AM",
      status: "Given",
      notes: "Check blood sugar before injection",
    },
    {
      id: 3,
      patient: "Michael Brown",
      drug: "Amoxicillin 250mg",
      time: "01:00 PM",
      status: "Pending",
      notes: "Take with water",
    },
    {
      id: 4,
      patient: "Emily Davis",
      drug: "Ibuprofen 400mg",
      time: "08:00 AM",
      status: "Given",
      notes: "For headache",
    },
    {
      id: 5,
      patient: "Robert Wilson",
      drug: "Metformin 500mg",
      time: "07:30 AM",
      status: "Pending",
      notes: "Take before meal",
    },
    {
      id: 6,
      patient: "Sophia Johnson",
      drug: "Omeprazole 20mg",
      time: "08:30 AM",
      status: "Pending",
      notes: "Take before breakfast",
    },
  ];

  return (
    <div
      className={`rounded-2xl p-4 ${darkMode ? "bg-[#1E2F3F]" : "bg-white"} shadow`}
    >
      <h3
        className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        Medication Schedule
      </h3>

      <ul
        className={`overflow-y-auto h-100 scrollbar-thin scrollbar-thumb-rounded-lg ${
          darkMode
            ? "scrollbar-thumb-[#2A435C] scrollbar-track-[#1E2F3F]"
            : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        }`}
      >
        {medications.map((med) => (
          <li
            key={med.id}
            className={`mb-2 p-3 border rounded-lg ${
              darkMode
                ? "border-gray-700 bg-[#2A435C] text-white"
                : "border-gray-200 bg-gray-50 text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium text-md">{med.patient}</p>
              <span
                className={`font-semibold ${med.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}
              >
                {med.status}
              </span>
            </div>
            <p className="text-sm mb-1">{med.drug}</p>
            <p className="text-sm text-gray-400">
              Time: {med.time} | Notes: {med.notes}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;

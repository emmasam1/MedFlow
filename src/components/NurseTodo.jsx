import React from "react";
import { useStore } from "../store/store";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const NurseTodo = () => {
  const { darkMode } = useStore();

  // Production-ready sample data
  const patients = [
    { id: 1, name: "John Doe", age: 45, bed: "A1", status: "Stable" },
    { id: 2, name: "Jane Smith", age: 60, bed: "B2", status: "Critical" },
    { id: 3, name: "Bob Johnson", age: 30, bed: "C3", status: "Stable" },
    { id: 4, name: "Emily Davis", age: 52, bed: "A2", status: "Stable" },
    { id: 5, name: "Michael Brown", age: 70, bed: "B1", status: "Critical" },
    { id: 6, name: "Sophia Wilson", age: 25, bed: "C1", status: "Stable" },
    { id: 7, name: "Robert Lee", age: 38, bed: "D4", status: "Stable" },
    { id: 8, name: "Linda Kim", age: 66, bed: "D2", status: "Critical" },
  ];

  return (
    <div
      className={`rounded-2xl p-4 h-full ${darkMode ? "bg-[#1E2F3F]" : "bg-white"} shadow`}
    >
      <h3
        className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        Patient List
      </h3>

      <ul
        className={`overflow-y-auto h-96 scrollbar-thin scrollbar-thumb-rounded-lg ${
          darkMode
            ? "scrollbar-thumb-[#2A435C] scrollbar-track-[#1E2F3F]"
            : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        }`}
      >
        {patients.map((p) => (
          <li
            key={p.id}
            className={`mb-2 p-3 border rounded-lg flex justify-between items-center ${
              darkMode
                ? "border-gray-700 bg-[#2A435C] text-white"
                : "border-gray-200 bg-gray-50 text-gray-800"
            }`}
          >
            <div>
              <p className="font-medium text-md">
                {p.name} ({p.age} yrs)
              </p>
              <p className="text-sm">
                Bed: {p.bed} | Status:{" "}
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    p.status === "Critical" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {p.status === "Critical" ? <FiAlertTriangle /> : <FiCheckCircle />}
                  {p.status}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NurseTodo;
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useStore } from "../store/store";

const SearchPatientTab = ({ onSelect }) => {
  const patients = useStore((state) => state.patients);
  const [query, setQuery] = useState("");

  //FILTER the patients
  const filteredPatients = patients.filter((patient) => {
    const q = query.toLowerCase();

    return (
      patient.patientId?.toLowerCase().includes(q) || // card no
      patient.fullName?.toLowerCase().includes(q) ||  // name
      String(patient.age).includes(q) ||              // age
      patient.phone?.includes(q)                      // phone
    );
  });

  return (
    <div className="w-full flex flex-col items-center space-y-6">

      {/* SEARCH INPUT */}
      <div className="relative w-full max-w-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Card No, Name, Age or Phone..."
          className="
            w-full border rounded-full px-10 py-3 text-sm
            bg-gray-50 dark:bg-[#ffffff]
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500/30
          "
        />

        <MagnifyingGlassIcon
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* RESULT LIST */}
      {query && (
        <div className="w-full max-w-sm space-y-2 max-h-60 overflow-y-auto">
          {filteredPatients.length === 0 && (
            <p className="text-sm text-gray-400 text-center">
              No patient found
            </p>
          )}

          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelect(patient)}
              className="
                p-3 rounded-lg border
                hover:bg-blue-50 dark:hover:bg-[#81b5f4]
                cursor-pointer transition
              "
            >
              <p className="font-semibold">{patient.fullName}</p>

              <p className="text-xs text-gray-500">
                {patient.patientId} • {patient.phone}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SearchPatientTab;

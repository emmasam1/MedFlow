import React from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline";

const ScanPatientTab = ({ onSelect }) => {
  const handleScan = () => {
    // simulate scanned patient
    onSelect({
      name: "Scanned Patient",
      id: "P009",
      phone: "+1 888 223",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">

      {/* SCAN AREA */}
      <div
        className="
          w-full max-w-sm
          border-2 border-dashed
          rounded-xl
          p-10
          flex flex-col items-center justify-center
          text-center
          transition-all
          border-gray-300 dark:border-gray-600
          bg-gray-50 dark:bg-[#111827]
        "
      >
        <QrCodeIcon className="w-10 h-10 mb-3 text-gray-400" />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scan Patient Card Barcode
        </p>

        <span className="text-xs text-gray-400 mt-1">
          Align the barcode within the frame
        </span>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={handleScan}
        className=" px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-allshadow-sm"
      >
        Simulate Scan
      </button>
    </div>
  );
};

export default ScanPatientTab;

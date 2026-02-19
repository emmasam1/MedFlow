import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const PatientIDCard = forwardRef(({ patient }, ref) => {
  if (!patient) return null;

  // ✅ Corrected Structured QR Data
  const qrData = JSON.stringify({
    type: "patient",
    patientId: patient.patientId, // Change "id" to "patientId"
    name: patient.fullName,
  });

  return (
    <div
      ref={ref}
      className="relative w-[340px] h-[200px] bg-white border border-gray-300 rounded-2xl p-4 shadow-lg"
    >
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-2 mb-3">
        <h2 className="font-bold text-blue-700 text-lg tracking-wide">
          CLINIVA HOSPITAL
        </h2>
        <p className="text-[11px] text-gray-500">Patient Identification Card</p>
      </div>

      {/* Body */}
      <div className="flex justify-between items-center h-[110px]">
        {/* Patient Info */}
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {patient.fullName}
          </p>
          <p>
            <span className="font-semibold">Age:</span> {patient.age}
          </p>
          <p>
            <span className="font-semibold">Card No:</span> {patient.patientId}
          </p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <QRCodeCanvas
            value={qrData}
            size={70} // 👈 Smaller, better for ID card
            bgColor="#ffffff"
            fgColor="#111827"
            level="H"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 right-4 text-[9px] text-gray-400">
        www.medFlow.com
      </div>
    </div>
  );
});

export default PatientIDCard;

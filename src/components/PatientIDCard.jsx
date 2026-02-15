import React, { forwardRef } from "react";

const PatientIDCard = forwardRef(({ patient }, ref) => {
  if (!patient) return null;

  return (
    <div
      ref={ref}
      className="relative w-[340px] h-[200px] bg-white border border-gray-400 rounded-xl p-4"
    >
      {/* Hospital Header */}
      <div className="text-center border-b pb-2 mb-3">
        <h2 className="font-bold text-lg">CLINIVA HOSPITAL</h2>
        <p className="text-xs text-gray-500">
          Patient Identification Card
        </p>
      </div>

      {/* Body */}
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-semibold text-lg">Name:</span> {patient.fullName}
        </p>
        <p>
          <span className="font-semibold text-lg">Age:</span> {patient.age}
        </p>
        <p>
          <span className="font-semibold text-lg">Card No:</span> {patient.patientId}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 right-4 text-[10px] text-gray-500">
        www.medFlow.com
      </div>
    </div>
  );
});

export default PatientIDCard;

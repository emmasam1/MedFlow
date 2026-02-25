import React, { forwardRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const PatientIDCard = forwardRef(({ patient }, ref) => {
  const [isBack, setIsBack] = useState(false);

  if (!patient) return null;

  const qrData = JSON.stringify({
    cardNumber: patient.cardNumber,
    id: patient.id,
  });

  return (
    <div className="flex flex-col items-center gap-3">
      {/* PRINT CONTAINER */}
      <div ref={ref} className="print:block">
        {/* ================= FRONT ================= */}
        <div
          className={`relative w-[340px] h-[200px] rounded-2xl shadow-xl overflow-hidden
          ${isBack ? "hidden print:block" : ""}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg tracking-wide">
                CLINIVA HOSPITAL
              </h2>
              <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded-full font-semibold">
                PATIENT ID
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={
                  patient.photo ||
                  `https://i.pravatar.cc/100?u=${patient.fullName}`
                }
                alt="patient"
                className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
              />

              <div className="text-sm space-y-1">
                <p className="font-semibold text-base capitalize">
                  {patient.fullName}
                </p>
                <p>Card No: {patient.cardNumber}</p>
                <p>Blood Group: {patient.bloodGroup || "N/A"}</p>
              </div>
            </div>

            <div className="absolute bottom-3 left-4 text-[12px]">
              <p>Emergency Contact: {patient?.nextOfKin?.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div
          className={`relative w-[340px] h-[200px] border border-gray-300 rounded-2xl p-4 mt-6 shadow-lg bg-white
          ${!isBack ? "hidden print:block" : ""}`}
        >
          <div className="text-center mb-2">
            <h2 className="font-bold text-blue-700 text-lg tracking-wide">
              CLINIVA HOSPITAL
            </h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex justify-center mb-3">
              <QRCodeCanvas
                value={qrData}
                size={100}
                level="M"
                includeMargin={true}
              />
            </div>

            <div className="text-[11px] text-left  space-y-1">
              <p className="font-semibold">If found, please return to:</p>
              <p>Cliniva Hospital</p>
              <p>123 Medical Avenue, Lagos</p>
              <p>+234 800 000 0000</p>
            </div>
          </div>
          <div className="flex justify-center text-gray-600 text-[11px]">
            <p>Powered by - www.medFlow.com</p>
          </div>
        </div>
      </div>

      {/* Toggle (hidden in print) */}
      <button
        onClick={() => setIsBack(!isBack)}
        className="text-sm bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition print:hidden"
      >
        {isBack ? "Show Front" : "Show Back"}
      </button>
    </div>
  );
});

export default PatientIDCard;

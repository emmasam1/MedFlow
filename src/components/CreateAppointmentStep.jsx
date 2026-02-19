import React, { useState } from "react";
import { useStore } from "../store/store";

const CreateAppointmentStep = ({ patient }) => {

  // 👇 get doctors from zustand
  const doctors = useStore((state) => state.doctors);

  // today's date auto
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    doctor: "",
    time: "",
  });

  return (
    <div className="space-y-6 h-96 rounded-lg overflow-y-scroll">

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-center">
        Create Appointment
      </h3>

      {/* ================= PATIENT INFO (AUTO FILLED) ================= */}
      <div className="bg-gray-50 dark:bg-[#ffffff] rounded-xl p-4 space-y-2">

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Patient Name</span>
          <span className="font-medium">{patient.fullName}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Patient ID</span>
          <span className="font-medium">{patient.patientId}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium">{patient.phone}</span>
        </div>

      </div>

      {/* ================= APPOINTMENT DETAILS ================= */}

      {/* DATE */}
      <div>
        <label className="text-sm text-gray-600">Date</label>
        <input
          type="date"
          value={form.date}
          readOnly
          className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* DOCTOR SELECT */}
      <div>
        <label className="text-sm text-gray-600">Assign Doctor</label>
        <select
          value={form.doctor}
          onChange={(e)=>setForm({...form, doctor:e.target.value})}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select Doctor</option>

          {doctors?.map((doc,i)=>(
            <option key={i} value={doc}>
              {doc}
            </option>
          ))}

        </select>
      </div>

      {/* TIME */}
      <div>
        <label className="text-sm text-gray-600">Time</label>
        <input
          type="time"
          value={form.time}
          onChange={(e)=>setForm({...form, time:e.target.value})}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        />
      </div>

      {/* CREATE BUTTON */}
      <button className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700transition cursor-pointer">
        Create Appointment
      </button>

    </div>
  );
};

export default CreateAppointmentStep;


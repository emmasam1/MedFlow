import { useState } from "react";
import { useStore } from "../store/store";

const VitalsTracker = () => {
  const { darkMode } = useStore();
  const [vitals, setVitals] = useState({
    temp: "",
    bp: "",
    pulse: "",
    respiration: "",
  });

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vitals Submitted", vitals);
    setVitals({ temp: "", bp: "", pulse: "", respiration: "" });
  };

  return (
    <div className={`rounded-2xl p-4 ${darkMode ? "bg-[#1E2F3F]" : "bg-white"} shadow`}>
      <h3 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Vitals Tracker</h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="temp"
          placeholder="Temperature"
          value={vitals.temp}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="bp"
          placeholder="Blood Pressure"
          value={vitals.bp}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="pulse"
          placeholder="Pulse"
          value={vitals.pulse}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="respiration"
          placeholder="Respiration Rate"
          value={vitals.respiration}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Submit Vitals
        </button>
      </form>
    </div>
  );
};

export default VitalsTracker;
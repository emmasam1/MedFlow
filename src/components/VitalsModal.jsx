import React, { useState, useEffect } from "react";

const initialVitals = {
  temperature: "",
  bloodPressure: "",
  pulse: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
  priority: "",
  allergies: "",
};

const VitalsModal = ({ queueItem, onClose, takeVitals }) => {
  const [vitals, setVitals] = useState(initialVitals);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (queueItem?.vitals) {
      setVitals({
        ...initialVitals,
        ...queueItem.vitals,
      });
    } else {
      setVitals(initialVitals);
    }
  }, [queueItem]);

  const handleChange = (field, value) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (!queueItem) return;

    setIsSubmitting(true);
    try {
      // Logic: store action updates status to "ready-for-doctor"
      await takeVitals(queueItem.id, vitals); 
      onClose();
      setVitals(initialVitals);
    } catch (err) {
      console.error("Error saving vitals", err);
      alert("Failed to save vitals. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      {/* <h2 className="text-xl font-bold mb-4 text-gray-800">
        Clinical Assessment: {queueItem?.patientName || "Patient"}
      </h2> */}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              placeholder="36.5"
              value={vitals.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Blood Pressure</label>
            <input
              type="text"
              placeholder="120/80"
              value={vitals.bloodPressure}
              onChange={(e) => handleChange("bloodPressure", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pulse (BPM)</label>
            <input
              type="number"
              placeholder="72"
              value={vitals.pulse}
              onChange={(e) => handleChange("pulse", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Resp. Rate (BPM)</label>
            <input
              type="number"
              placeholder="16"
              value={vitals.respiratoryRate}
              onChange={(e) => handleChange("respiratoryRate", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SPO2 (%)</label>
            <input
              type="number"
              placeholder="98"
              value={vitals.oxygenSaturation}
              onChange={(e) => handleChange("oxygenSaturation", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="70"
              value={vitals.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Height (cm)</label>
            <input
              type="number"
              placeholder="175"
              value={vitals.height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Triage Priority</label>
            <select
              value={vitals.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select Priority</option>
              <option value="low">Low (Routine)</option>
              <option value="medium">Medium (Urgent)</option>
              <option value="high">High (Emergency)</option>
            </select>
          </div>
        </div>

        {/* Allergies Section */}
        <div className="pt-2">
          <label className="block text-sm font-bold text-red-600 mb-1 uppercase tracking-wide">
            Known Allergies
          </label>
          <textarea
            placeholder="List allergies (e.g. Penicillin, Peanuts). If none, type 'N/A'."
            value={vitals.allergies}
            onChange={(e) => handleChange("allergies", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-red-200 bg-red-50 focus:ring-2 focus:ring-red-400 outline-none transition-colors resize-none"
            rows="3"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-start gap-3">
          {/* <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Complete Assessment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VitalsModal;
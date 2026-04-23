import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";

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
    e.preventDefault();
    if (!queueItem) return;

    setIsSubmitting(true);

    try {
      // ✅ split blood pressure
      const [systolic, diastolic] = vitals.bloodPressure
        ? vitals.bloodPressure.split("/")
        : ["", ""];

      // ✅ merge allergies into comment
      const comment = `
${vitals.allergies ? `Allergies: ${vitals.allergies}` : ""}
      `.trim();

      const payload = {
        queueId: queueItem.queueId,

        temperature: { value: Number(vitals.temperature) },

        bloodPressure: {
          systolic: Number(systolic),
          diastolic: Number(diastolic),
        },

        // ✅ pulse → heartRate
        heartRate: { value: Number(vitals.pulse) },

        respiratoryRate: { value: Number(vitals.respiratoryRate) },

        oxygenSaturation: { value: Number(vitals.oxygenSaturation) },

        weight: { value: Number(vitals.weight) },

        height: { value: Number(vitals.height) },

        // map priority → painLevel (temporary)
        painLevel: vitals.priority ? Number(vitals.priority) || 0 : 0,

        comment,
      };

      // console.log(payload)

      await takeVitals(queueItem.id, payload);
      toast.success("Vitals saved successfully.");
      onClose();
      setVitals(initialVitals);
    } catch (err) {
      console.error("Error saving vitals", err);
      toast.error("Failed to save vitals. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
       <ToastContainer  transition={Bounce}/>
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
              <option value="1">Low (Routine)</option>
              <option value="5">Medium (Urgent)</option>
              <option value="10">High (Emergency)</option>
            </select>
          </div>
        </div>

        {/* Allergies (now used as comment source) */}
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

        {/* Submit */}
        <div className="flex justify-start gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Complete Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VitalsModal;
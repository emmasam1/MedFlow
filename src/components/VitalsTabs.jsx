import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTemperatureHigh,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaSyringe,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdMonitorHeart } from "react-icons/md";
import { GiHeartInside } from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";

// Dummy vitals
const dummyVitals = {
  temperature: 36.8,
  bloodPressure: "120/80",
  heartRate: 75,
  respirationRate: 18,
  oxygenSaturation: 98,
  weight: 70,
  height: 175,
  bmi: 23,
  painLevel: 2,
  bloodGlucose: 95,
};

// Helper for color coding
const getVitalColor = (label, value) => {
  let val = value;
  if (typeof val === "string") {
    // extract numeric part from string like "36.8 °C"
    const match = val.match(/[\d.]+/);
    val = match ? Number(match[0]) : 0;
  }

  switch (label) {
    case "Temperature":
      return val < 36 || val > 37.5
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    case "Blood Pressure": {
      const [sys, dia] = String(value).split("/").map(Number);
      if (!sys || !dia) return "bg-gray-100 text-gray-700";
      return sys > 140 || dia > 90
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    }
    case "Heart Rate":
      return val < 60 || val > 100
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    case "Respiration Rate":
      return val < 12 || val > 20
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    case "Oxygen Saturation":
      return val < 95
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    case "BMI":
      return val < 18.5 || val > 24.9
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";
    case "Pain Level":
      return val > 5
        ? "bg-red-100 text-red-700"
        : val > 2
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";
    case "Blood Glucose":
      return val < 70 || val > 140
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const VitalsTabs = ({ patient, darkMode }) => {
  const [activeTab, setActiveTab] = useState("self-0");

  // Use dummy vitals if none exist
  const patientRecords = patient.vitalsRecords?.length
    ? patient.vitalsRecords
    : [
        {
          vitals: dummyVitals,
          timestamp: new Date().toISOString(),
          takenBy: "Nurse John",
          role: "Triage Nurse",
          department: "General",
        },
      ];

  const tabs = [
    ...patientRecords.map((record, i) => ({
      key: `self-${i}`,
      label: `${record.department} (${record.takenBy})`,
      vitals: record.vitals,
      timestamp: record.timestamp,
      takenBy: record.takenBy,
      role: record.role,
      department: record.department,
    })),
    ...(patient.familyMembers?.flatMap((member, fi) => {
      const famRecords = member.vitalsRecords?.length
        ? member.vitalsRecords
        : [
            {
              vitals: dummyVitals,
              timestamp: new Date().toISOString(),
              takenBy: "Nurse Mary",
              role: "Triage Nurse",
              department: "General",
            },
          ];
      return famRecords.map((record, i) => ({
        key: `family-${fi}-${i}`,
        label: `${member.name} - ${record.department}`,
        vitals: record.vitals,
        timestamp: record.timestamp,
        takenBy: record.takenBy,
        role: record.role,
        department: record.department,
      }));
    }) || []),
  ];

  const vitalItems = (vitals) => [
    {
      label: "Temperature",
      value: `${vitals.temperature} °C`,
      icon: <FaTemperatureHigh className="w-5 h-5 text-red-500" />,
    },
    {
      label: "Blood Pressure",
      value: vitals.bloodPressure,
      icon: <MdMonitorHeart className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Heart Rate",
      value: `${vitals.heartRate} bpm`,
      icon: <FaHeartbeat className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "Respiration Rate",
      value: `${vitals.respirationRate} /min`,
      icon: <WiHumidity className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Oxygen Saturation",
      value: `${vitals.oxygenSaturation} %`,
      icon: <GiHeartInside className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "Weight",
      value: `${vitals.weight} kg`,
      icon: <FaWeight className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Height",
      value: `${vitals.height} cm`,
      icon: <FaRulerVertical className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "BMI",
      value: vitals.bmi,
      icon: <FaChartBar className="w-5 h-5 text-teal-500" />,
    },
    {
      label: "Pain Level",
      value: `${vitals.painLevel} /10`,
      icon: <FaExclamationTriangle className="w-5 h-5 text-red-700" />,
    },
    {
      label: "Blood Glucose",
      value: `${vitals.bloodGlucose} mg/dL`,
      icon: <FaSyringe className="w-5 h-5 text-pink-700" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap border-b border-gray-300 gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            className={`px-4 py-2 -mb-px font-medium rounded-t ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              activeTab === tab.key && (
                <motion.div
                  key={tab.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full"
                >
                  <p
                    className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <strong>Taken by:</strong> {tab.takenBy} ({tab.role}) |{" "}
                    <strong>Department:</strong> {tab.department} |{" "}
                    <strong>Time:</strong>{" "}
                    {new Date(tab.timestamp).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vitalItems(tab?.vitals).map((vital, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-md shadow-sm ${darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"}`}
                      >
                        {vital.icon}
                        <div>
                          <p className="text-sm font-medium">{vital.label}</p>
                          <p
                            className={`text-lg font-semibold px-2 py-1 rounded ${getVitalColor(vital.label, vital.value)}`}
                          >
                            {vital.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VitalsTabs;

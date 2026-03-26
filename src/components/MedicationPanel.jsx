import { motion } from "framer-motion";

const MedicationPanel = ({ medications = [] }) => {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2F3F] shadow">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Medication Panel</h3>
      {medications.length === 0 ? (
        <p className="text-gray-400 text-sm">No medications assigned</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {medications.map((med, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A435C]"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{med.name}</p>
                <p className="text-xs text-gray-400">{med.dosage}</p>
              </div>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  med.status === "administered"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => console.log("Administered", med)}
              >
                {med.status === "administered" ? "Done" : "Administer"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationPanel;
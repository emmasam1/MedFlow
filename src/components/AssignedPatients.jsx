const AssignedPatients = ({ patients = [] }) => {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2F3F] shadow">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Assigned Patients</h3>
      {patients.length === 0 ? (
        <p className="text-gray-400 text-sm">No patients assigned</p>
      ) : (
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {patients.map((p, i) => (
            <li
              key={i}
              className="p-2 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#2A435C]"
            >
              <span className="text-gray-800 dark:text-white">{p.name}</span>
              <span className="text-xs text-gray-400">{p.room || "N/A"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedPatients;
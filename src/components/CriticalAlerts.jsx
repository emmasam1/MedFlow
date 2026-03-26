const CriticalAlerts = ({ alerts = [] }) => {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2F3F] shadow">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Critical Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-gray-400 text-sm">No alerts</p>
      ) : (
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {alerts.map((alert, i) => (
            <li
              key={i}
              className="p-2 rounded border border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            >
              {alert.message || "Critical issue detected!"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CriticalAlerts;
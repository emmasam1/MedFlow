const ShiftSchedule = ({ shifts = [] }) => {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2F3F] shadow">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Shift Schedule</h3>
      {shifts.length === 0 ? (
        <p className="text-gray-400 text-sm">No shifts scheduled</p>
      ) : (
        <ul className="space-y-2">
          {shifts.map((shift, i) => (
            <li
              key={i}
              className="p-2 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#2A435C]"
            >
              <span className="text-gray-800 dark:text-white">{shift.time}</span>
              <span className="text-xs text-gray-400">{shift.notes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShiftSchedule;
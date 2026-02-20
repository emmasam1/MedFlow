import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCalendar, FiCheck, FiX, FiFilter, FiUser } from 'react-icons/fi';
import { useAppStore } from '../store/useAppstore';

const AppointmentManager = () => {
  const { appointments, fetchAppointments, updateApptStatus, loading } = useAppStore();
  const [filterDate, setFilterDate] = useState("");

  // Fetch appointments on load and whenever date filter changes
  useEffect(() => {
    fetchAppointments(filterDate);
  }, [filterDate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointment Registry</h1>
          <p className="text-gray-500 text-sm">Manage and track patient schedules</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <FiPlus /> New Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards (Optional but looks great for hospitals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Today" count={appointments.length} color="blue" />
        <StatCard title="Pending" count={appointments.filter(a => a.status === 'pending').length} color="yellow" />
        <StatCard title="Completed" count={appointments.filter(a => a.status === 'completed').length} color="green" />
      </div>

      {/* Appointment Table/List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading schedules...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Date/Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {appointments.map((appt) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={appt.id} 
                    className="border-t border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiUser />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appt.patientName}</p>
                          <p className="text-xs text-gray-400">{appt.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{appt.assignedDoctor}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{appt.date}</span>
                        <span className="text-xs text-gray-400">{appt.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {appt.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateApptStatus(appt.id, 'completed')}
                              className="p-2 hover:bg-green-100 text-green-600 rounded-md" 
                              title="Complete"
                            >
                              <FiCheck size={18}/>
                            </button>
                            <button 
                              onClick={() => updateApptStatus(appt.id, 'cancelled')}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-md" 
                              title="Cancel"
                            >
                              <FiX size={18}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`p-5 rounded-xl border-l-4 bg-white shadow-sm border-${color}-500`}>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{count}</p>
  </div>
);

export default AppointmentManager;
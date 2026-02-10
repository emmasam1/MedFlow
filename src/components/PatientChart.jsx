import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const PatientChart = () => {
  const [period, setPeriod] = useState('Daily');

  const chartDataMap = {
    Daily: [24.9, 21.8, 28.7, 24.6],
    Weekly: [180, 150, 210, 170],
    Monthly: [720, 650, 800, 700],
  };

  const statsMap = {
    Daily: ['320%', '280%', '370%', '317%'],
    Weekly: ['2,100%', '1,800%', '2,600%', '2,000%'],
    Monthly: ['8,500%', '7,500%', '9,000%', '8,200%'],
  };

  const data = {
    labels: ['Dengue', 'Typhoid', 'Malaria', 'Cold'],
    datasets: [
      {
        data: chartDataMap[period],
        backgroundColor: ['#818cf8', '#d97706', '#374151', '#94a3b8'],
        borderWidth: 1,
        borderColor: '#fff',
        cutout: '60%',
      },
    ],
  };

  const stats = [
    { label: 'Dengue', value: statsMap[period][0], color: 'bg-indigo-400' },
    { label: 'Typhoid', value: statsMap[period][1], color: 'bg-amber-600' },
    { label: 'Malaria', value: statsMap[period][2], color: 'bg-slate-700' },
    { label: 'Cold', value: statsMap[period][3], color: 'bg-slate-400' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-sans max-w-sm">
      {/* Title */}
      <h2 className="text-sm font-bold text-slate-800 mb-4">Patient Chart</h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4 text-xs font-semibold">
        {['Daily', 'Weekly', 'Monthly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-2 py-1 rounded ${
              period === tab ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Animate chart and total */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period} // triggers animation when period changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Chart */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Doughnut
              data={data}
              options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-800">
                {chartDataMap[period].reduce((a, b) => a + b, 0)}
              </span>
              <span className="text-xs text-slate-400">Total People</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-xs ">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2 justify-center"
              >
                <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500">{item.label}</p>
                  <p className="text-slate-800 font-bold">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PatientChart;

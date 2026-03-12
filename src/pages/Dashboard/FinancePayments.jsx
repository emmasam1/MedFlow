import React, { useState, useMemo, useEffect } from "react";
import { Button, Popover } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer } from "react-toastify";

const FinancePayments = () => {
  const { queue, getQueue, processPayment, cancelQueue } = useAppStore();
  const { darkMode } = useStore();

  const [search, setSearch] = useState("");
  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    getQueue();
  }, []);

  const awaitingPayment = useMemo(() => {
    return queue
      .filter((q) => q.status === "waiting" && !q.paid)
      .filter((q) =>
        q.patientName?.toLowerCase().includes(search.toLowerCase()),
      );
  }, [queue, search]);

  const handlePayment = async (queueId, method) => {
    await processPayment(queueId, method);
    setOpenPopover(null);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } rounded-2xl shadow-sm p-4`}
    >
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payments</h2>
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
      </div>

      <div className="overflow-y-auto max-h-[70vh] space-y-4">
        <AnimatePresence>
          {awaitingPayment.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex-1">
                <p className="font-medium">{q.patientName}</p>
                <p className="text-sm text-slate-400">{q.reason}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                 <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to cancel this queue?",
                                )
                              ) {
                                cancelQueue(q.id);
                              }
                            }}
                            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            Cancel
                          </button>

                <Popover
                  title="Select Payment Method"
                  trigger="click"
                  open={openPopover === q.id}
                  onOpenChange={(open) => setOpenPopover(open ? q.id : null)}
                  content={
                    <div className="flex gap-2">
                      {["Cash", "POS", "Transfer"].map((method) => (
                        <span
                          className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 cursor-pointer"
                          key={method}
                          type="primary"
                          onClick={() => handlePayment(q.id, method)}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  }
                >
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 cursor-pointer">
                    Accept Payment
                  </span>
                </Popover>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {awaitingPayment.length === 0 && (
          <p className="text-sm text-slate-400 mt-4">
            No patients awaiting payment.
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancePayments;

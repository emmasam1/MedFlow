import React, { useState, useMemo, useEffect } from "react";
import { Popover } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer } from "react-toastify";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaFlask,
  FaUserMd,
} from "react-icons/fa";

const serviceIcons = {
  consultation: <FaUserMd />,
  lab: <FaFlask />,
  pharmacy: <FaMoneyBillWave />,
  radiology: <FaFlask />,
  cardiology: <FaUserMd />,
};

const amountMap = {
  consultation: 5000,
  lab: 3000,
  pharmacy: 2000,
  radiology: 4000,
  cardiology: 6000,
  physiotherapy: 3500,
  admission: 10000,
};

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
      .filter(
        (q) =>
          q.paymentStatus === "unpaid" &&
          q.currentDepartment === "finance" &&
          q.status !== "cancelled"
      )
      .filter((q) =>
        q.patientName?.toLowerCase().includes(search.toLowerCase())
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
      } rounded-2xl shadow-sm p-6`}
    >
      <ToastContainer />

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Finance Payments</h2>

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

      {/* PAYMENT LIST */}

      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <AnimatePresence>
          {awaitingPayment.map((q) => {
            const amount = amountMap[q.service] || 0;

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* PATIENT INFO */}

                <div className="flex items-center gap-4 flex-1">
                  <div className="text-blue-500 text-xl">
                    {serviceIcons[q.service] || <FaMoneyBillWave />}
                  </div>

                  <div>
                    <p className="font-semibold">{q.patientName}</p>

                    <p className="text-sm text-gray-400">
                      {q.service === "consultation"
                        ? "Consultation Fee"
                        : `Payment for ${q.service}`}
                    </p>
                  </div>
                </div>

                {/* SERVICE BADGE */}

                <div className="flex flex-col items-start md:items-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full capitalize ${
                      darkMode
                        ? "bg-purple-700 text-white"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {q.service}
                  </span>
                </div>

                {/* AMOUNT */}

                <div className="text-lg font-semibold text-green-500">
                  ₦{amount.toLocaleString()}
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm("Cancel this payment request?")) {
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
                    onOpenChange={(open) =>
                      setOpenPopover(open ? q.id : null)
                    }
                    content={
                      <div className="flex gap-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg"
                          onClick={() => handlePayment(q.id, "cash")}
                        >
                          <FaMoneyBillWave /> Cash
                        </button>

                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg"
                          onClick={() => handlePayment(q.id, "pos")}
                        >
                          <FaCreditCard /> POS
                        </button>

                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg"
                          onClick={() => handlePayment(q.id, "transfer")}
                        >
                          <FaUniversity /> Transfer
                        </button>
                      </div>
                    }
                  >
                    <button className="px-3 py-1 text-xs rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200">
                      Accept Payment
                    </button>
                  </Popover>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {awaitingPayment.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No patients awaiting payment
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancePayments;
import React, { useState, useMemo, useEffect } from "react";
// Added Skeleton and Spin from antd
import { Popover, Skeleton, Spin } from "antd"; 
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaFlask,
  FaUserMd,
  FaCalendarAlt,
  FaWallet,
} from "react-icons/fa";

const serviceIcons = {
  REGISTRATION: <FaUserMd />,
  LABORATORY: <FaFlask />,
  PHARMACY: <FaMoneyBillWave />,
};

const FinancePayments = () => {
  const {
    queue,
    getQueue,
    processPayment,
    cancelQueue,
    loading, // Main fetch loading state
  } = useAppStore();

  const { darkMode } = useStore();

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [openPopover, setOpenPopover] = useState(null);
  
  // Track which specific item is currently being paid
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    getQueue("finance_officer", selectedDate);
  }, [getQueue, selectedDate]);

  const awaitingPayment = useMemo(() => {
    if (!Array.isArray(queue)) return [];
    return queue.filter((q) => {
      const recordDate = q.createdAt?.split("T")[0];
      const isSelectedDay = recordDate === selectedDate;
      const isFinance = q.currentStage === "FINANCE";
      const matchesSearch =
        q.patientId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        q.patientId?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        q.queueId?.toLowerCase().includes(search.toLowerCase());

      return isFinance && matchesSearch && q.status === "active" && isSelectedDay;
    });
  }, [queue, search, selectedDate]);

  const handlePayment = async (readableQueueId, method) => {
    setProcessingId(readableQueueId);
    try {
      await processPayment(readableQueueId, method);
      setOpenPopover(null);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} rounded-2xl shadow-sm p-6 min-h-[500px]`}>
      <ToastContainer  transition={Bounce}/>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Queue Payments</h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}>
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm outline-none border-none focus:ring-0"
            />
          </div>
          <input
            type="text"
            placeholder="Search name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm flex-1 md:w-64 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
      </div>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* SKELETON LOADER: Shows while fetching initial queue data */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {awaitingPayment.map((q) => {
              const totalToPay = q.totalAwaiting || 0;
              const isItemProcessing = processingId === q.queueId;

              return (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  {/* PATIENT INFO */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-blue-500 text-2xl bg-blue-50 p-3 rounded-full">
                      {serviceIcons[q.items?.[0]?.category] || <FaMoneyBillWave />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold capitalize">{q.patientId?.firstName} {q.patientId?.lastName}</p>
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-mono">{q.queueId}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {q.items?.map((item) => item.name).join(", ")}
                      </div>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1">
                    <div className="text-lg font-bold text-green-600">₦{totalToPay.toLocaleString()}</div>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-bold ${q.isUrgent ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                      {q.currentStage}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isItemProcessing}
                      onClick={() => confirm("Cancel this request?") && cancelQueue(q._id)}
                      className="text-xs px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <Popover
                      title="Select Payment Method"
                      trigger="click"
                      open={openPopover === q._id && !isItemProcessing}
                      onOpenChange={(open) => setOpenPopover(open ? q._id : null)}
                      content={
                        <div className="flex flex-col gap-2 w-40">
                          <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "cash")}><FaMoneyBillWave className="text-green-500" /> Cash</button>
                          <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "pos")}><FaCreditCard className="text-blue-500" /> POS</button>
                          <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "transfer")}><FaUniversity className="text-purple-500" /> Transfer</button>
                          <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "wallet")}><FaWallet className="text-orange-500" /> Wallet</button>
                        </div>
                      }
                    >
                      <button 
                        disabled={isItemProcessing}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all flex items-center justify-center min-w-[140px]"
                      >
                        {/* PAYMENT PROCESSING LOADER */}
                        {isItemProcessing ? (
                          <div className="flex items-center gap-2">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 14, color: 'white' }} spin />} />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          `Accept ₦${totalToPay.toLocaleString()}`
                        )}
                      </button>
                    </Popover>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {!loading && awaitingPayment.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No pending payments for {selectedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePayments;
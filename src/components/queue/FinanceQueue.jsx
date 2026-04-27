import React, { useState, useMemo, useEffect } from "react";
import {
  Skeleton,
  Calendar,
  ConfigProvider,
  theme,
  Popover,
  Badge,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiCalendar, HiOutlineClipboardList } from "react-icons/hi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaFlask,
  FaUserMd,
  FaWallet,
} from "react-icons/fa";

const serviceIcons = {
  REGISTRATION: <FaUserMd />,
  LABORATORY: <FaFlask />,
  PHARMACY: <FaMoneyBillWave />,
};

const EmptyQueueState = ({ date, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? "bg-gray-800" : "bg-blue-900/30"}`}>
      <HiOutlineClipboardList size={48} className={darkMode ? "text-gray-600" : "text-blue-400"} />
    </div>
    <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>All Caught Up!</h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm">
      No pending payments for <span className="font-semibold text-blue-500">{dayjs(date).format("DD MMM YYYY")}</span>.
    </p>
  </motion.div>
);

const FinanceQueue = () => {
  const { queue = [], getQueue, user, processPayment } = useAppStore();
  const { darkMode } = useStore();

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      await getQueue(user?.role, selectedDate);
      setLocalLoading(false);
    };
    fetchData();
  }, [selectedDate, user?.role, getQueue]);
  

  const awaitingPayment = useMemo(() => {
    if (!Array.isArray(queue)) return [];
    return queue.filter((q) => {
      const isSelectedDay = dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate;
      const isFinance = q.currentStage === "FINANCE";
      const fullName = `${q.patientId?.firstName} ${q.patientId?.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || q.queueId?.toLowerCase().includes(search.toLowerCase());
      return isFinance && q.status === "active" && isSelectedDay && matchesSearch;
    });
  }, [queue, search, selectedDate]);


  const handlePayment = async (readableQueueId, method) => {
    setOpenPopover(null); // Close popover immediately
    setProcessingId(readableQueueId); // Start loading state for this specific row
    try {
      await processPayment(readableQueueId, method);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessingId(null);
    }
  };

  const stats = {
    total: awaitingPayment.length,
    finance: awaitingPayment.filter((q) => q.currentStage === "FINANCE").length,
  };

  const fullCellRender = (date, info) => {
    if (info.type !== "date") return info.originNode;

    const dateStr = date.format("YYYY-MM-DD");
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === dayjs().format("YYYY-MM-DD");

    const hasPending = queue.some(
      (q) =>
        dayjs(q.createdAt).format("YYYY-MM-DD") === dateStr &&
        q.currentStage === "FINANCE" &&
        q.status === "active"
    );

    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected ? "!bg-blue-600 !text-white shadow-md" : ""}
            ${!isSelected && hasPending ? "bg-red-50 text-red-600 border border-red-200 font-bold" : ""}
            ${!isSelected && isToday ? "border border-blue-500 text-blue-500 font-medium" : ""}
            ${!isSelected && !isToday && !hasPending ? (darkMode ? "text-gray-400" : "text-gray-700") : ""}
          `}
        >
          {date.date()}
          {hasPending && (isSelected || isToday) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}>
      <ToastContainer transition={Bounce} />

      <div className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}>
        <div>
          <h2 className="text-xl font-bold">Finance Queue</h2>
          <p className="text-xs text-gray-500">Process patient payments and billing</p>
        </div>

        <div className="flex items-center gap-5">
          <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
              <HiCalendar className="text-blue-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`bg-transparent text-sm outline-none cursor-pointer ${darkMode ? "[color-scheme:dark]" : ""}`}
              />
            </div>
          </ConfigProvider>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-[400px] border-r ${darkMode ? "border-gray-800" : "border-gray-100"} p-5 hidden lg:block overflow-y-auto`}>
          <ConfigProvider
            theme={{
              algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: { colorPrimary: "#3b82f6" },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={(val) => setSelectedDate(val.format("YYYY-MM-DD"))}
              fullCellRender={fullCellRender}
            />
          </ConfigProvider>

          <div className={`mt-6 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-slate-50 border-transparent"}`}>
            <p className="text-sm text-gray-500 mb-1">{dayjs(selectedDate).format("MMMM D, YYYY")}</p>
            <p className="text-3xl font-bold">{awaitingPayment.length} Queue</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-500 text-sm">Finance</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                {stats.finance}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or Queue ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-gray-800 border-gray-700 placeholder-gray-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {localLoading ? (
              <div className="p-6"><Skeleton active avatar /></div>
            ) : awaitingPayment.length === 0 ? (
              <EmptyQueueState date={selectedDate} darkMode={darkMode} />
            ) : (
              <AnimatePresence>
                {awaitingPayment.map((q) => {
                  const isItemProcessing = processingId === q.queueId; // Logic fix: compare with queueId
                  const totalToPay = q.totalAwaiting || 0; 

                  return (
                    <motion.div
                      key={q._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                    >
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

                      <div className="flex items-center gap-6">
                        <div className="text-lg font-bold text-green-600">₦{totalToPay.toLocaleString()}</div>

                        <Popover
                          title="Select Payment Method"
                          trigger="click"
                          open={openPopover === q._id}
                          onOpenChange={(open) => setOpenPopover(open ? q._id : null)}
                          content={
                            <div className="flex flex-col gap-2 w-40">
                              <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "cash")}>
                                <FaMoneyBillWave className="text-green-500" /> Cash
                              </button>
                              <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "pos")}>
                                <FaCreditCard className="text-blue-500" /> POS
                              </button>
                              <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "transfer")}>
                                <FaUniversity className="text-purple-500" /> Transfer
                              </button>
                              <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => handlePayment(q.queueId, "wallet")}>
                                <FaWallet className="text-orange-500" /> Wallet
                              </button>
                            </div>
                          }
                        >
                          <button
                            disabled={isItemProcessing}
                            className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all flex items-center justify-center min-w-[140px] disabled:bg-purple-400"
                          >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceQueue;
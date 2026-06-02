import React, { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { RiDownload2Line } from "react-icons/ri";
import { Popover } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaUniversity, FaWallet } from "react-icons/fa";
import { useStore } from "../../store/store";

const Transactions = () => {
  const { darkMode } = useStore();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  
  // 🔄 New Toggle State to pull historic balances across all time
  const [showAllOutstanding, setShowAllOutstanding] = useState(false);
  
  // ⚡ Popover tracking state matching your structure
  const [openPopover, setOpenPopover] = useState(null);
  const [isItemProcessing, setIsItemProcessing] = useState(false);

  // 🔐 MOCK USER ROLE
  const currentUser = { name: "John Doe", role: "finance" };
  const isReadOnly = currentUser.role === "admin";

  // 📝 DUMMY DATA (Now includes dates to test filtering logic)
  const [transactions, setTransactions] = useState([
    {
      id: "TX-1001",
      patientName: "Chinedu Okafor",
      service: "Consultation",
      paymentMethod: "cash",
      amount: 10000,
      balance: 0,
      createdAt: dayjs().hour(9).minute(15).toISOString(), // Today
    },
    {
      id: "TX-1002",
      patientName: "Amina Bello",
      service: "Pharmacy",
      paymentMethod: "pos",
      amount: 18500,
      balance: 0,
      createdAt: dayjs().hour(10).minute(42).toISOString(), // Today
    },
    {
      id: "TX-1003",
      patientName: "Olumide Awosika",
      service: "Laboratory",
      paymentMethod: "transfer",
      amount: 25000,
      balance: 5000, 
      createdAt: dayjs().hour(11).minute(0).toISOString(), // Today
    },
    {
      id: "TX-1004",
      patientName: "Grace Emmanuel",
      service: "Radiology",
      paymentMethod: "transfer",
      amount: 45000,
      balance: 0,
      createdAt: dayjs().subtract(1, "day").toISOString(), // Yesterday
    },
    {
      id: "TX-1005",
      patientName: "Funmi Adebayo",
      service: "Admission",
      paymentMethod: "pos",
      amount: 60000,
      balance: 20000, 
      createdAt: dayjs().subtract(2, "day").toISOString(), // 2 days ago
    },
  ]);

  // ✅ ANT DESIGN POPOVER SUBMIT HANDLER
  const handlePaymentResolution = (transactionId, selectedMethod) => {
    if (isReadOnly) return;
    setIsItemProcessing(true);

    // Mimic API delay
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId
            ? { ...t, balance: 0, paymentMethod: selectedMethod }
            : t
        )
      );
      setOpenPopover(null); // Close the popover safely
      setIsItemProcessing(false);
    }, 400);
  };

  // ✅ SMART FILTER LOGIC
  const displayedTransactions = transactions.filter((t) => {
    if (showAllOutstanding) {
      return t.balance > 0; // Bring all outstanding, ignoring chosen date
    }
    // Otherwise filter strictly by selected calendar date
    return dayjs(t.createdAt).format("YYYY-MM-DD") === selectedDate;
  });

  const totalRevenue = displayedTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const methodBadge = (method) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return darkMode ? "bg-green-950/40 text-green-400 border border-green-800/30" : "bg-green-100 text-green-700";
      case "pos":
        return darkMode ? "bg-blue-950/40 text-blue-400 border border-blue-800/30" : "bg-blue-100 text-blue-700";
      case "transfer":
        return darkMode ? "bg-purple-950/40 text-purple-400 border border-purple-800/30" : "bg-purple-100 text-purple-700";
      case "wallet":
        return darkMode ? "bg-amber-950/40 text-amber-400 border border-amber-800/30" : "bg-amber-100 text-amber-700";
      default:
        return darkMode ? "bg-gray-800 text-gray-400 border border-gray-700" : "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {showAllOutstanding ? "All Outstanding Invoices" : "Daily Transactions"}
            </h2>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              isReadOnly ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
            }`}>
              {currentUser.role} View
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {showAllOutstanding ? "Viewing global unpaid accounts across all history logs" : "Daily financial transaction history ledger"}
          </p>
        </div>

        {/* CONTROLS AREA */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 🌟 VIEW ALL OUTSTANDING TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setShowAllOutstanding(!showAllOutstanding)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
              showAllOutstanding
                ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                : darkMode
                ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {showAllOutstanding ? "Show All Transactions" : "View All Outstanding"}
          </button>

          {/* HIDE DATEPICKER IF LOOKING AT CONSOLIDATED DEBTS */}
          {!showAllOutstanding && (
            <DatePicker
              value={dayjs(selectedDate)}
              onChange={(d) => d && setSelectedDate(d.format("YYYY-MM-DD"))}
            />
          )}

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <RiDownload2Line size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* SUMMARY PANEL */}
      <div className={`mb-6 p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-slate-50"}`}>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {showAllOutstanding ? "Total Unpaid Outstanding Revenue" : "Total Revenue Selected"}
          </span>
          <span className={`text-lg font-semibold ${showAllOutstanding ? "text-red-400" : "text-emerald-500"}`}>
            ₦{totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={`text-left border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-slate-200 text-gray-500"}`}>
            <tr>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Service</th>
              <th className="py-3 px-3">Payment Method</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Outstanding</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">{showAllOutstanding ? "Invoice Date" : "Time"}</th>
            </tr>
          </thead>

          <tbody>
            {displayedTransactions.map((t, i) => {
              const amount = Number(t.amount || 0);
              const outstanding = Number(t.balance || 0);
              const isPartial = outstanding > 0;

              return (
                <tr
                  key={t.id || i}
                  className={`border-b transition-colors ${
                    darkMode ? "border-gray-800 hover:bg-gray-800/40" : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td className="py-3 px-3 text-gray-400">{i + 1}</td>
                  <td className="py-3 px-3 font-medium">{t.patientName}</td>
                  <td className="py-3 px-3 capitalize">{t.service}</td>

                  {/* PAYMENT METHOD */}
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium capitalize ${methodBadge(t.paymentMethod)}`}>
                      {t.paymentMethod}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="py-3 px-3 font-semibold">
                    ₦{amount.toLocaleString()}
                  </td>

                  {/* OUTSTANDING COLUMN ACCESSED BY ANTD POPOVER */}
                  <td className="py-3 px-3">
                    {outstanding > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-semibold">
                          ₦{outstanding.toLocaleString()}
                        </span>
                        
                        {!isReadOnly ? (
                          <Popover
                            title={<span className={darkMode ? "text-gray-200" : ""}>Select Payment Method</span>}
                            trigger="click"
                            open={openPopover === t.id && !isItemProcessing}
                            onOpenChange={(open) => setOpenPopover(open ? t.id : null)}
                            overlayClassName={darkMode ? "dark-popover" : ""}
                            content={
                              <div className="flex flex-col gap-1 w-36">
                                <button 
                                  type="button"
                                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded text-left transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`} 
                                  onClick={() => handlePaymentResolution(t.id, "cash")}
                                >
                                  <FaMoneyBillWave className="text-green-500" /> Cash
                                </button>
                                <button 
                                  type="button"
                                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded text-left transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`} 
                                  onClick={() => handlePaymentResolution(t.id, "pos")}
                                >
                                  <FaCreditCard className="text-blue-500" /> POS
                                </button>
                                <button 
                                  type="button"
                                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded text-left transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`} 
                                  onClick={() => handlePaymentResolution(t.id, "transfer")}
                                >
                                  <FaUniversity className="text-purple-500" /> Transfer
                                </button>
                                <button 
                                  type="button"
                                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded text-left transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`} 
                                  onClick={() => handlePaymentResolution(t.id, "wallet")}
                                >
                                  <FaWallet className="text-orange-500" /> Wallet
                                </button>
                              </div>
                            }
                          >
                            <button
                              type="button"
                              className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-sm"
                            >
                              Collect
                            </button>
                          </Popover>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-emerald-500 text-xs font-medium">Cleared</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        isPartial
                          ? darkMode ? "bg-yellow-950/40 text-yellow-400 border border-yellow-800/20" : "bg-yellow-100 text-yellow-700"
                          : darkMode ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/20" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isPartial ? "Partial" : "Full"}
                    </span>
                  </td>

                  {/* TIME / DYNAMIC DATE DISPLAY */}
                  <td className="py-3 px-3 text-gray-400">
                    {t.createdAt 
                      ? dayjs(t.createdAt).format(showAllOutstanding ? "DD MMM YYYY" : "HH:mm") 
                      : "--:--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {displayedTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-400 border-b border-dashed border-gray-700/30">
            No records found matching this criterion
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
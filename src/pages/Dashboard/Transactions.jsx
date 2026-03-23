import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { RiDownload2Line } from "react-icons/ri";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";

const Transactions = () => {
  const { transactions, getDailyTransactions, downloadDailyReport } =
    useAppStore();

  const { darkMode } = useStore();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    getDailyTransactions(selectedDate);
  }, [selectedDate, getDailyTransactions]);

  // ✅ TOTAL
  const total = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  // ✅ METHOD BADGE
  const methodBadge = (method) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-700";
      case "pos":
        return "bg-blue-100 text-blue-700";
      case "transfer":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm ${
        darkMode ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-gray-400">
            Daily financial transaction history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(d) => {
              if (!d) return;
              setSelectedDate(d.format("YYYY-MM-DD"));
            }}
          />

          <button
            onClick={() => downloadDailyReport(selectedDate)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RiDownload2Line size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div
        className={`mb-6 p-4 rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-slate-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Revenue</span>

          <span className="text-lg font-semibold text-emerald-500">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead
            className={`text-left border-b ${
              darkMode ? "border-gray-700" : "border-slate-200"
            }`}
          >
            <tr>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Service</th>
              <th className="py-3 px-3">Payment Method</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Outstanding</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => {
              // ✅ FIX: fallback values
              const amount = Number(t.amount || 0);

              // If you later store balance in transactions, this will work
              const outstanding = Number(t.balance || 0);

              // ✅ infer type
              const isPartial = outstanding > 0;

              return (
                <tr
                  key={t.id}
                  className={`border-b ${
                    darkMode
                      ? "border-gray-800 hover:bg-gray-800"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td className="py-3 px-3">{i + 1}</td>

                  <td className="py-3 px-3 font-medium">
                    {t.patientName}
                  </td>

                  <td className="py-3 px-3 capitalize">
                    {t.service}
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize ${methodBadge(
                        t.paymentMethod
                      )}`}
                    >
                      {t.paymentMethod || "unknown"}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="py-3 px-3 font-semibold">
                    ₦{amount.toLocaleString()}
                  </td>

                  {/* OUTSTANDING */}
                  <td className="py-3 px-3">
                    {outstanding > 0 ? (
                      <span className="text-red-500 text-xs">
                        ₦{outstanding.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-green-500 text-xs">
                        Cleared
                      </span>
                    )}
                  </td>

                  {/* TYPE */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isPartial
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isPartial ? "Partial" : "Full"}
                    </span>
                  </td>

                  {/* TIME */}
                  <td className="py-3 px-3 text-gray-400">
                    {t.createdAt
                      ? dayjs(t.createdAt).format("HH:mm")
                      : "--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No transactions found for this date
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
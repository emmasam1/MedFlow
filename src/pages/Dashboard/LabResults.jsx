import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { FiEye, FiDownload } from "react-icons/fi";
import { generateLabPDF } from "../../utils/generateLabPDF";

const LabResults = () => {
  const navigate = useNavigate();

  const { darkMode } = useStore();
  const { fetchPatients, getAllLabResults } = useAppStore();

  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const results = getAllLabResults();

  /* ---------------- FILTER ---------------- */

  const filteredResults = results.filter((r) => {
    if (filter === "all") return true;

    const hasIssue = r.tests?.some(
      (t) => t.result?.toLowerCase() === "positive"
    );

    return filter === "attention" ? hasIssue : !hasIssue;
  });

  /* ---------------- FORMAT ---------------- */

  const formattedData = filteredResults.map((r, i) => ({
    ...r,
    sn: i + 1,
    formattedDate: dayjs(r.date).format("DD MMM YYYY"),
    testSummary: r.tests
      ?.map((t) => `${t.name}: ${t.result}`)
      .join(", "),
    status:
      r.tests?.some((t) => t.result?.toLowerCase() === "positive")
        ? "Attention"
        : "Normal",
  }));

  /* ---------------- COLUMNS ---------------- */

  const columns = [
    // { title: "S/N", key: "sn", sortable: true },
    { title: "CARD NO", key: "patientCode", sortable: true },
    { title: "FULL NAME", key: "patientName", sortable: true },
    { title: "DATE", key: "formattedDate", sortable: true },
    { title: "RESULT", key: "testSummary", sortable: false },
    {
      title: "STATUS",
      key: "status",
      sortable: true,
      render: (v) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            v === "Attention"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {v}
        </span>
      ),
    },
  ];

  /* ---------------- ACTIONS ---------------- */

  const actions = (row) => (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      {/* VIEW */}
      <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer" onClick={() => setSelected(row)}>
        <FiEye />
      </div>

      {/* DOWNLOAD PDF */}
      <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer" onClick={() => generateLabPDF(row)}>
        <FiDownload />
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`p-4 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lab Results</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className="px-3 py-1 border rounded"
          >
            All
          </button>

          <button
            onClick={() => setFilter("normal")}
            className="px-3 py-1 border rounded text-green-600"
          >
            Normal
          </button>

          <button
            onClick={() => setFilter("attention")}
            className="px-3 py-1 border rounded text-red-600"
          >
            Attention
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={formattedData}
        searchableKeys={["patientName", "patientCode"]}
        actions={actions}
        onRowClick={(row) =>
          navigate(`/dashboard/patient-profile/${row.patientId}`)
        }
      />

      {/* ---------------- MODAL ---------------- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } w-[550px] rounded-xl p-6`}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
            >
              <h2 className="text-lg font-bold mb-4">
                {selected.patientName}
              </h2>

              <p className="text-sm text-gray-400 mb-2">
                {dayjs(selected.date).format("DD MMM YYYY")}
              </p>

              {/* TEST RESULTS */}
              <div className="space-y-2">
                {selected.tests?.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>{t.name}</span>
                    <span
                      className={
                        t.result?.toLowerCase() === "positive"
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {t.result}
                    </span>
                  </div>
                ))}
              </div>

              {/* NOTES */}
              <p className="mt-4 text-sm">
                <strong>Notes:</strong> {selected.notes || "—"}
              </p>

              {/* FILE VIEW 🔥 */}
              {selected.file && (
                <div className="mt-4">
                  <a
                    href={selected.file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    View Uploaded Lab Report
                  </a>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => generateLabPDF(selected)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Download PDF
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabResults;
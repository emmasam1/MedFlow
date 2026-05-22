import React, { useState, useMemo, useEffect, useRef } from "react";
import { Skeleton, Calendar, ConfigProvider, theme, Badge } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import {
  HiSearch,
  HiCalendar,
  HiOutlineClipboardList,
  HiBeaker,
  HiUpload,
  HiX,
} from "react-icons/hi";
import { RiCapsuleLine } from "react-icons/ri";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import Modal from "../Modal";

const EmptyQueueState = ({ date, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? "bg-gray-800" : "bg-emerald-900/30"}`}
    >
      <HiBeaker
        size={48}
        className={darkMode ? "text-gray-600" : "text-emerald-400"}
      />
    </div>
    <h3
      className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
    >
      No Pharmacy Requests
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
      No Pharmacy orders found for{" "}
      <span className="font-semibold text-emerald-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      .
    </p>
  </motion.div>
);

const PharmacyQueue = () => {
  const { queue = [], getQueue, user, updateLabResults } = useAppStore();
  const { darkMode } = useStore();
  console.log("user", user);

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);

  const [labResults, setLabResults] = useState({});
  const [finalSummary, setFinalSummary] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  console.log("PHARMACY QUEUE:", queue);

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      // Fetching queue based on pharmacy role
      await getQueue(user?.role, selectedDate);
      setLocalLoading(false);
    };
    fetchData();
  }, [selectedDate, user?.role, getQueue]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(queue)) return [];
    return queue.filter((q) => {
      const matchesDate =
        dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate;
      const patient = q.patientId || {};
      const fullName =
        `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        q.queueId?.toLowerCase().includes(search.toLowerCase());

      // Specifically target PHARMACY stage
      const isPharmacyStage = q.currentStage === "PHARMACY";

      return (
        matchesDate && matchesSearch && isPharmacyStage && q.status === "active"
      );
    });
  }, [queue, selectedDate, search]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async () => {
    if (!selectedQueue?.queueId) {
      toast.error("Queue ID is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // 1. Identify the Pharmacy Drug
      const labItem = selectedQueue?.items?.find(
        (i) => i.category === "PHARMACY",
      );

      // We use the specific test name as the key for findings
      const testNameValue = labItem?.name || "Laboratory Test";
      const resultNoteValue =
        labResults[testNameValue] || finalSummary || "Completed";

      // 2. Append text fields
      formData.append("testName", testNameValue);
      formData.append("resultNote", resultNoteValue);

      // 3. Append the file
      // IMPORTANT: If Postman works, ensure the key 'report' matches Postman's key exactly
      if (selectedFiles.length > 0) {
        // We send the first file to ensure compatibility with .single('report') on backend
        formData.append("report", selectedFiles[0]);
      }

      // 🔍 DEEP LOGGING: Loop through FormData to see actual keys/values
      console.group("🧪 DEBUG: Final Form Data Fields");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`📁 Field [${key}]:`, {
            fileName: value.name,
            fileSize: value.size,
            fileType: value.type,
          });
        } else {
          console.log(`📝 Field [${key}]:`, value);
        }
      }
      console.groupEnd();

      // 4. Submit to Zustand Store
      const result = await updateLabResults(selectedQueue.queueId, formData);

      if (result.success) {
        toast.success("Lab updated successfully!");
        setLabModalOpen(false);
        setSelectedFiles([]);
        setLabResults({});
        setFinalSummary("");
        getQueue();
      } else {
        console.error("❌ Backend Error:", result.message);
        toast.error(result.message || "Submission failed (500)");
      }
    } catch (err) {
      console.error("💥 Critical Frontend Error:", err);
      toast.error("Check console for crash details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: filteredData.length,
    pendingTests: filteredData.reduce(
      (acc, curr) =>
        acc +
        (curr.items?.filter((item) => item.category === "PHARMACY").length ||
          0),
      0,
    ),
  };

  const openLabAction = (q) => {
    setSelectedQueue(q);
    setLabModalOpen(true);
  };

  // RESTORED: Custom Calendar Render Logic adapted for Lab
  const fullCellRender = (date, info) => {
    if (info.type !== "date") return info.originNode;
    const dateStr = date.format("YYYY-MM-DD");
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === dayjs().format("YYYY-MM-DD");

    const hasPharmacyWork = queue.some(
      (q) =>
        dayjs(q.updatedAt).format("YYYY-MM-DD") === dateStr &&
        q.currentStage === "PHARMACY" &&
        q.status === "active",
    );

    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected ? "!bg-emerald-600 !text-white shadow-md" : ""}
            ${!isSelected && hasPharmacyWork ? "bg-amber-50 text-amber-600 border border-amber-200 font-bold" : ""}
            ${!isSelected && isToday ? "border border-emerald-500 text-emerald-500 font-medium" : ""}
            ${!isSelected && !isToday && !hasPharmacyWork ? (darkMode ? "text-gray-400" : "text-gray-700") : ""}
          `}
        >
          {date.date()}
          {hasPharmacyWork && (isSelected || isToday) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}
    >
      <ToastContainer transition={Bounce} />

      {/* Header */}
      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Pharmacy Queue</h2>
          <p className="text-xs text-gray-500">
            Processing pharmacy requests and results
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
        >
          <HiCalendar className="text-emerald-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-sm outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-[400px] border-r ${darkMode ? "border-gray-800" : "border-gray-100"} p-5 hidden lg:block overflow-y-auto`}
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: { colorPrimary: "#10b981" },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={(val) => setSelectedDate(val.format("YYYY-MM-DD"))}
              fullCellRender={fullCellRender}
            />
          </ConfigProvider>

          <div
            className={`mt-6 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-emerald-50/30 border-transparent"}`}
          >
            <p className="text-sm text-gray-500 mb-1">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-3xl font-bold">{stats.total} Patients</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Drugs to Dispense</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}
                >
                  {stats.pendingTests}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient name or Queue ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {localLoading ? (
              <Skeleton active avatar className="p-6" />
            ) : filteredData.length === 0 ? (
              <EmptyQueueState date={selectedDate} darkMode={darkMode} />
            ) : (
              <AnimatePresence>
                {filteredData.map((q) => (
                  <motion.div
                    key={q._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-5 rounded-2xl border flex justify-between items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold bg-emerald-50 text-emerald-600">
                        {q.patientId?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold capitalize">
                          {q.patientId?.firstName} {q.patientId?.lastName}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {q.items
                            ?.filter((i) => i.category === "PHARMACY")
                            .map((test, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200"
                              >
                                {test.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openLabAction(q)}
                      className="text-xs font-bold px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Record Results
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Enterprise Pharmacy Modal */}
      <Modal
        isOpen={labModalOpen}
        onClose={() => !isSubmitting && setLabModalOpen(false)}
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <RiCapsuleLine className="text-emerald-600 text-xl" />
              </div>

              <div>
                <h2 className="font-bold text-lg">Dispense Medication</h2>

                <p className="text-xs text-gray-500">
                  Queue ID: {selectedQueue?.queueId}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase text-gray-400 font-bold">
                Patient
              </p>

              <p className="font-semibold capitalize">
                {selectedQueue?.patientId?.firstName}{" "}
                {selectedQueue?.patientId?.lastName}
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Patient Clinical Summary */}
          <div
            className={`rounded-2xl border p-5 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-blue-50 border-blue-100"
            }`}
          >
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                  Diagnosis
                </p>

                <p className="font-semibold text-sm">
                  {selectedQueue?.diagnosis || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                  Clinical Notes
                </p>

                <p className="text-sm leading-relaxed">
                  {selectedQueue?.clinicalNotes || "No notes"}
                </p>
              </div>
            </div>
          </div>

          {/* Prescription Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <HiOutlineClipboardList className="text-emerald-500" />
                Prescribed Medications
              </h3>

              <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold">
                {selectedQueue?.items?.filter((i) => i.category === "PHARMACY")
                  .length || 0}{" "}
                Items
              </div>
            </div>

            <div
              className={`rounded-2xl overflow-hidden border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div
                className={`grid grid-cols-12 gap-4 px-5 py-3 text-[10px] uppercase tracking-widest font-bold ${
                  darkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                <div className="col-span-4">Medication</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {selectedQueue?.items
                  ?.filter((i) => i.category === "PHARMACY")
                  .map((drug, idx) => {
                    const qty = drug.quantity || 1;
                    const price = drug.price || 2500;
                    const total = qty * price;

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-12 gap-4 px-5 py-4 items-center ${
                          darkMode ? "bg-gray-900" : "bg-white"
                        }`}
                      >
                        {/* Drug */}
                        <div className="col-span-4">
                          <p className="font-semibold text-sm">{drug.name}</p>

                          <p className="text-xs text-gray-500 mt-1">
                            Oral Medication
                          </p>
                        </div>

                        {/* Qty */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            defaultValue={qty}
                            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${
                              darkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          />
                        </div>

                        {/* Price */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            defaultValue={price}
                            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none ${
                              darkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          />
                        </div>

                        {/* Total */}
                        <div className="col-span-2">
                          <p className="font-bold text-emerald-600">
                            ₦{total.toLocaleString()}
                          </p>
                        </div>

                        {/* Availability */}
                        <div className="col-span-2">
                          <select
                            className={`w-full px-2 py-2 rounded-lg text-xs font-semibold border outline-none ${
                              darkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <option>Available</option>
                            <option>Low Stock</option>
                            <option>Out of Stock</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div
            className={`rounded-2xl border p-5 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-emerald-50/40 border-emerald-100"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">Subtotal</p>

              <p className="font-semibold">
                ₦{selectedQueue?.totalPaid?.toLocaleString() || "0"}
              </p>
            </div>

            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">Service Charge</p>

              <p className="font-semibold">₦500</p>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            <div className="flex justify-between items-center">
              <p className="font-bold">Grand Total</p>

              <p className="text-2xl font-black text-emerald-600">
                ₦{((selectedQueue?.totalPaid || 0) + 500).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Pharmacist Notes */}
          <div>
            <label className="text-[11px] uppercase font-bold tracking-widest text-gray-500">
              Pharmacist Notes
            </label>

            <textarea
              rows={3}
              placeholder="Medication instructions, patient counseling, stock notes..."
              value={finalSummary}
              onChange={(e) => setFinalSummary(e.target.value)}
              className={`w-full mt-2 p-4 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
            <button className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition">
              Out of Stock
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setLabModalOpen(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                {isSubmitting ? "Dispensing..." : "Dispense Medication"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PharmacyQueue;

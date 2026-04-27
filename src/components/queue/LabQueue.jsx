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
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import Modal from "../../components/Modal";

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
      No Lab Requests
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
      No laboratory orders found for{" "}
      <span className="font-semibold text-emerald-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      .
    </p>
  </motion.div>
);

const LabQueue = () => {
  const { queue = [], getQueue, user, updateLabResults } = useAppStore();
  const { darkMode } = useStore();

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

  //   console.log(queue);

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      // Fetching queue based on lab role
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

      // Specifically target LABORATORY stage
      const isLabStage = q.currentStage === "LABORATORY";

      return (
        matchesDate && matchesSearch && isLabStage && q.status === "active"
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

      // 1. Identify the Laboratory Test
      const labItem = selectedQueue?.items?.find(
        (i) => i.category === "LABORATORY",
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
        getQueue()
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
        (curr.items?.filter((item) => item.category === "LABORATORY").length ||
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

    const hasLabWork = queue.some(
      (q) =>
        dayjs(q.createdAt).format("YYYY-MM-DD") === dateStr &&
        q.currentStage === "LABORATORY" &&
        q.status === "active",
    );

    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected ? "!bg-emerald-600 !text-white shadow-md" : ""}
            ${!isSelected && hasLabWork ? "bg-amber-50 text-amber-600 border border-amber-200 font-bold" : ""}
            ${!isSelected && isToday ? "border border-emerald-500 text-emerald-500 font-medium" : ""}
            ${!isSelected && !isToday && !hasLabWork ? (darkMode ? "text-gray-400" : "text-gray-700") : ""}
          `}
        >
          {date.date()}
          {hasLabWork && (isSelected || isToday) && (
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
          <h2 className="text-xl font-bold">Laboratory Queue</h2>
          <p className="text-xs text-gray-500">
            Processing test requests and results
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
                <span className="text-gray-500 text-sm">Tests to Perform</span>
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
                            ?.filter((i) => i.category === "LABORATORY")
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

      {/* Lab Result Modal Placeholder */}
      <Modal
        isOpen={labModalOpen}
        onClose={() => !isSubmitting && setLabModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <HiBeaker className="text-emerald-500" />
            <span className="capitalize">
              Lab Results: {selectedQueue?.patientId?.firstName}{" "}
              {selectedQueue?.patientId?.lastName}
            </span>
          </div>
        }
      >
        {/* Clinical Context */}
        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-blue-50 border-blue-100"}`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                Clinical Notes
              </p>
              <p className="text-sm leading-relaxed">
                {selectedQueue?.clinicalNotes || "No notes"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                Diagnosis
              </p>
              <p className="text-sm font-semibold">
                {selectedQueue?.diagnosis || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Test Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <HiOutlineClipboardList className="text-gray-400" /> Required Tests
          </h3>
          {selectedQueue?.items
            ?.filter((i) => i.category === "LABORATORY")
            .map((test, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <p className="text-sm font-bold text-emerald-600 mb-2">
                  {test.name}
                </p>
                <textarea
                  placeholder={`Findings for ${test.name}...`}
                  rows={2}
                  name="resultNote"
                  className={`w-full p-3 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}`}
                  onChange={(e) =>
                    setLabResults({
                      ...labResults,
                      [test.name]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
        </div>

        {/* Upload Section */}
        <div className="pt-2">
          <label className="text-[11px] font-bold text-gray-500 uppercase">
            Attachments
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${darkMode ? "border-gray-700 hover:border-emerald-500 bg-gray-800" : "border-gray-200 hover:border-emerald-500 bg-gray-50"}`}
            >
              <HiUpload className="text-emerald-500" size={20} />
              <span className="text-[9px] font-bold text-gray-500">
                Add File
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              name="report"
              multiple
              accept="image/*,application/pdf"
            />

            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className={`relative w-20 h-20 rounded-xl border p-1 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-10"
                >
                  <HiX size={10} />
                </button>
                {file.type.includes("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover rounded-lg"
                    alt="preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] text-center p-1 break-all">
                    {file.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final Summary */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase">
            Final Summary
          </label>
          <textarea
            placeholder="General observations..."
            className={`w-full mt-1 p-3 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            value={finalSummary}
            onChange={(e) => setFinalSummary(e.target.value)}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
          <button
            onClick={() => setLabModalOpen(false)}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-500"
          >
            Discard
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className={`px-8 py-2.5 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
          >
            {isSubmitting ? "Submitting..." : "Submit Results"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LabQueue;

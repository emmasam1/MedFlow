import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  ConfigProvider,
  theme,
  Tabs,
  Collapse,
  Skeleton,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import {
  HiSearch,
  HiChevronDown,
  HiOutlineInbox,
  HiCalendar,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useStore } from "../../store/store";
import Modal from "../Modal"; // Ensure path points to your custom Modal layout

// Mock dataset structured exactly like MongoDB / Backend model relations
const MOCK_DATASET = [
  {
    _id: "appt_001",
    queueId: "QA-8821",
    createdAt: dayjs().toISOString(),
    currentStage: "CONSULTATION",
    status: "active",
    isUrgent: true,
    reasonForVisit: "Chronic Migraine & Fatigue Review",
    patientId: { firstName: "Sarah", lastName: "Connor" },
    labResults: [],
  },
  {
    _id: "appt_002",
    queueId: "QA-4019",
    createdAt: dayjs().toISOString(),
    currentStage: "CONSULTATION",
    status: "active",
    isUrgent: false,
    reasonForVisit: "Post-op Neurological Evaluation",
    patientId: { firstName: "Arthur", lastName: "Dent" },
    labResults: [
      {
        testName: "Full Blood Count",
        resultNote: "Normal range",
        createdAt: dayjs().subtract(2, "hour").toISOString(),
      },
    ],
  },
  {
    _id: "appt_003",
    queueId: "QA-9931",
    createdAt: dayjs().add(1, "day").toISOString(),
    currentStage: "CONSULTATION",
    status: "active",
    isUrgent: false,
    reasonForVisit: "Oncology Biopsy Follow-up",
    patientId: { firstName: "Ellen", lastName: "Ripley" },
    labResults: [],
  },
];

const LAB_OPTIONS = [
  { name: "Malaria RDT", amount: 5500 },
  { name: "Full Blood Count (FBC)", amount: 4000 },
  { name: "Urinalysis", amount: 2500 },
  { name: "Liver Function Test", amount: 8000 },
  { name: "Kidney Function Test", amount: 7500 },
];

const DRUG_OPTIONS = [
  { name: "Paracetamol", amount: 1200 },
  { name: "Ibuprofen", amount: 1500 },
  { name: "Amoxicillin", amount: 2500 },
  { name: "Omeprazole", amount: 2200 },
];

const EmptyQueueState = ({ date, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}
    >
      <HiOutlineInbox
        size={38}
        className={darkMode ? "text-gray-600" : "text-blue-500"}
      />
    </div>
    <h3
      className={`text-base font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}
    >
      All Caught Up!
    </h3>
    <p className="text-gray-500 text-xs max-w-xs mx-auto">
      No diagnostic or consultation items slated for{" "}
      <span className="font-semibold text-blue-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      .
    </p>
  </motion.div>
);

// Resizer handlers
const handleMouseDown = () => {
  if (window.innerWidth >= 1024) isDragging.current = true;
};

const SpecialistAppointment = () => {
  const { darkMode } = useStore();

  // State Management
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [activeVitalId, setActiveVitalId] = useState(null);

  // Modals Framework Controls
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Interactive Consultation Form Controls
  const [openConsultation, setOpenConsultation] = useState(false);
  const [isQueueId, setIsQueueId] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [labAddons, setLabAddons] = useState([]);
  const [drugAddons, setDrugAddons] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate loading switch on day shifts
  useEffect(() => {
    setLocalLoading(true);
    const timer = setTimeout(() => setLocalLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  // Compute metrics pipelines
  const filteredData = useMemo(() => {
    return MOCK_DATASET.filter((q) => {
      const matchesDate =
        dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate;
      const patient = q.patientId || {};
      const fullName =
        `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        q.queueId?.toLowerCase().includes(search.toLowerCase());
      return matchesDate && matchesSearch && q.status === "active";
    });
  }, [selectedDate, search]);

  const stats = useMemo(
    () => ({
      total: filteredData.length,
      urgent: filteredData.filter((q) => q.isUrgent).length,
    }),
    [filteredData],
  );

  // Simulated Clinical Data Handlers
  const getPatientVital = async (queueId) => {
    setActiveVitalId(queueId);
    try {
      // Mimicking structure expected by tabs render pipeline
      const dummySummary = {
        currentVitals: {
          temperature: { value: 37.4 },
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: { value: 72 },
          oxygenSaturation: { value: 98 },
          bmi: "22.4",
          comment: "Patient stable. Normal target boundaries on check-in.",
        },
        pastLabResults: [
          {
            testName: "Complete Blood Count",
            resultNote: "Platelets slightly elevated",
            createdAt: dayjs().subtract(3, "day").toISOString(),
            fileUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ],
      };
      setSummaryData(dummySummary);
      setSummaryOpen(true);
    } catch (e) {
      toast.error("Error evaluating parameters");
    } finally {
      setActiveVitalId(null);
    }
  };

  const startConsultation = (q) => {
    setIsQueueId(q.queueId);
    setClinicalNotes(q.clinicalNotes || "");
    setDiagnosis(q.diagnosis || "");
    setLabAddons([]);
    setDrugAddons([]);
    setOpenConsultation(true);
  };

  const handleAddonOperation = (action, type, payload) => {
    const stateHook = type === "lab" ? setLabAddons : setDrugAddons;
    if (action === "ADD") {
      stateHook((prev) =>
        prev.find((x) => x.name === payload.name)
          ? prev
          : [
              ...prev,
              {
                ...payload,
                category: type === "lab" ? "LABORATORY" : "PHARMACY",
              },
            ],
      );
    } else {
      stateHook((prev) => prev.filter((x) => x.name !== payload));
    }
  };

  const handleSubmitConsultation = async () => {
      console.log('====================================');
      console.log("submitting");
      console.log('====================================');
      
    };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}
    >
      <ToastContainer transition={Bounce} />

      {/* COMPONENT HEADER */}
      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Specialist Workspace</h2>
          <p className="text-xs text-gray-500">
            Track and write targeted clinical configurations
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"}`}
        >
          <HiCalendar className="text-blue-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-sm outline-none cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {/* CORE WORKSPACE SPLIT PANELS */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT COMPACT PANELS - CALENDAR UTILITIES */}
        <div
          className={`w-[400px] border-r ${darkMode ? "border-gray-800" : "border-gray-100"} p-5 hidden lg:block overflow-y-auto`}
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: { colorPrimary: "#3b82f6" },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={(val) => setSelectedDate(val.format("YYYY-MM-DD"))}
              fullCellRender={(date, info) => {
                if (info.type !== "date") return info.originNode;
                const dateStr = date.format("YYYY-MM-DD");
                const isSelected = dateStr === selectedDate;
                const hasData = MOCK_DATASET.some(
                  (appt) =>
                    dayjs(appt.createdAt).format("YYYY-MM-DD") === dateStr,
                );
                return (
                  <div className="flex items-center justify-center h-full w-full">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative ${isSelected ? "bg-blue-600 text-white font-bold" : hasData ? "bg-amber-50 text-amber-600 font-bold border border-amber-200" : ""}`}
                    >
                      {date.date()}
                      {hasData && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </ConfigProvider>

          {/* BLOCK COUNTER CONTAINER */}
          <div
            className={`mt-6 p-5 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-slate-50 border-transparent"}`}
          >
            <p className="text-xs text-gray-400 mb-0.5">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-2xl font-bold mb-3">
              {stats.total} Appts Queued
            </p>
            {stats.urgent > 0 && (
              <div className="flex justify-between items-center text-xs bg-red-500/10 text-red-500 p-2 rounded-lg font-bold">
                <span>Urgent Emergency Priorities</span>
                <span>{stats.urgent} Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-slate-100 dark:bg-gray-800 hover:bg-blue-500 cursor-col-resize transition-colors"
        />

        {/* RIGHT COMPLEX PANEL - WORKFLOW QUEUE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient indices or identifiers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-slate-200"}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {localLoading ? (
              <div className="p-4">
                <Skeleton active avatar />
              </div>
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
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                      >
                        {q.patientId?.firstName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm capitalize">
                            {q.patientId?.firstName} {q.patientId?.lastName}
                          </h4>
                          {q.isUrgent && (
                            <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          {q.reasonForVisit} •{" "}
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-gray-700 px-1 py-0.2 rounded text-slate-500">
                            {q.queueId}
                          </span>
                        </p>

                        {q?.labResults?.length > 0 && (
                          <div
                            className={`mt-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border w-fit ${darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600"}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                            Diagnostic Updates Attached
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => startConsultation(q)}
                        className="text-xs font-bold px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all flex-1 sm:flex-none"
                      >
                        {q?.labResults?.length > 0
                          ? "Resume Consultation"
                          : "Start Case"}
                      </button>
                      <button
                        onClick={() => getPatientVital(q.queueId)}
                        className="text-xs font-bold px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all min-w-[110px] flex items-center justify-center flex-1 sm:flex-none"
                      >
                        {activeVitalId === q.queueId ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Patient Profile"
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: DIAGNOSTIC METRICS PROFILE & CHARTS DISPLAY */}
      <Modal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        title="Clinical Diagnostics Summary"
      >
        {summaryData && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Vitals Parameters",
                children: (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div
                      className={`p-3 rounded-xl ${summaryData.currentVitals.temperature.value >= 38 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                    >
                      <p className="text-[11px] opacity-80">Temperature</p>
                      <p className="text-lg font-black">
                        {summaryData.currentVitals.temperature.value}°C
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                      <p className="text-[11px] opacity-80">Blood Pressure</p>
                      <p className="text-lg font-black">
                        {summaryData.currentVitals.bloodPressure.systolic}/
                        {summaryData.currentVitals.bloodPressure.diastolic}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-700 col-span-2">
                      <p className="text-[11px] opacity-80">
                        BMI Status Indicator
                      </p>
                      <p className="text-base font-black">
                        {summaryData.currentVitals.bmi} Summary Index
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 col-span-2">
                      <p className="text-[11px] opacity-80">
                        Triage Intake Log Comments
                      </p>
                      <p className="font-semibold italic mt-0.5">
                        "{summaryData.currentVitals.comment}"
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Historical Lab Ledger",
                children: (
                  <Collapse
                    bordered={false}
                    items={summaryData.pastLabResults.map((lab, i) => ({
                      key: i,
                      label: (
                        <div className="flex justify-between items-center w-full pr-2 text-xs">
                          <span className="font-bold">{lab.testName}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400">
                              {dayjs(lab.createdAt).format("DD/MM/YYYY")}
                            </span>
                            {lab.fileUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPdfUrl(lab.fileUrl);
                                  setPdfOpen(true);
                                }}
                                className="text-blue-500 hover:underline"
                              >
                                View PDF
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                      children: (
                        <div className="text-xs bg-slate-50 p-2.5 rounded-lg">
                          <p className="text-gray-500">
                            Diagnostic Finding Summary Note:
                          </p>
                          <p className="font-medium mt-1">{lab.resultNote}</p>
                        </div>
                      ),
                    }))}
                  />
                ),
              },
            ]}
          />
        )}
      </Modal>

      {/* MODAL 2: SYSTEM CONSULTATION WORKFLOW PANEL */}
      <Modal
        isOpen={openConsultation}
        onClose={() => setOpenConsultation(false)}
        title={
          clinicalNotes
            ? "Amend Consultation Record"
            : "Execute Consultation Interface"
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">
              Clinical / Diagnostic Observations
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg resize-none border-gray-300"
              // placeholder="Write clinical notes..."
              placeholder="Describe symptoms, localized reviews, etc..."
            />
          </div>

          <div>
            <label className="font-bold block mb-1">
              Primary Clinical Diagnosis
            </label>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg resize-none border-gray-300"
              placeholder="Enter formal diagnostic classification..."
            />
          </div>

          {/* DIAGNOSTIC WORKUP ADDONS */}
          <div>
            <label className="font-bold block mb-1">
              Order Laboratory Modules
            </label>
            <select
              onChange={(e) => {
                const item = LAB_OPTIONS.find((l) => l.name === e.target.value);
                if (item) handleAddonOperation("ADD", "lab", item);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select internal panel test options...
              </option>
              {LAB_OPTIONS.map((lab) => (
                <option key={lab.name} value={lab.name}>
                  {lab.name} (₦{lab.amount})
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {labAddons.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg"
                >
                  {item.name} • ₦{item.amount}{" "}
                  <button
                    onClick={() =>
                      handleAddonOperation("REMOVE", "lab", item.name)
                    }
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* PHARMACEUTICAL PROVISIONS */}
          <div>
            <label className="font-bold block mb-1">
              Prescription Routing Dispensary
            </label>
            <select
              onChange={(e) => {
                const item = DRUG_OPTIONS.find(
                  (d) => d.name === e.target.value,
                );
                if (item) handleAddonOperation("ADD", "drug", item);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select drug routing formulation...
              </option>
              {DRUG_OPTIONS.map((drug) => (
                <option key={drug.name} value={drug.name}>
                  {drug.name} (₦{drug.amount})
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {drugAddons.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg"
                >
                  {item.name} • ₦{item.amount}{" "}
                  <button
                    onClick={() =>
                      handleAddonOperation("REMOVE", "drug", item.name)
                    }
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* TOTAL TRANSACTION LEDGER SUMMARY */}
          <div className="flex justify-between font-bold border-t pt-3 text-sm">
            <span>Aggregated Direct Billing Charges</span>
            <span className="text-blue-600">
              ₦
              {[...labAddons, ...drugAddons]
                .reduce((sum, i) => sum + i.amount, 0)
                .toLocaleString()}
            </span>
          </div>

           <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              onClick={handleSubmitConsultation}
              disabled={isSubmitting}
              className={`bg-blue-600 text-white py-2 px-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
             {isSubmitting
              ? "Committing Database Registry..."
              : "Commit Consultation Portfolio"}
            </button>
          </div>
        </div>
      </Modal>

      {/* NESTED LAB PDF VISUAL PREVIEW LIGHTBOX */}
      <Modal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        title="Diagnostic Report Engine Viewport"
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] rounded-xl border"
            title="Report Framework"
          />
        ) : (
          <p className="text-xs text-gray-400">
            Target document reference could not be built.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default SpecialistAppointment;

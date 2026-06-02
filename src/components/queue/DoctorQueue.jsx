import React, { useState, useMemo, useEffect } from "react";
import {
  Skeleton,
  Calendar,
  ConfigProvider,
  theme,
  Tabs,
  Collapse,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiCalendar, HiOutlineClipboardList } from "react-icons/hi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import VitalsModal from "../../components/VitalsModal";
import Modal from "../../components/Modal";
import PrescriptionSection from "../../components/consultation/PrescriptionSection"

const EmptyQueueState = ({ date, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? "bg-gray-800" : "bg-blue-900/30"}`}
    >
      <HiOutlineClipboardList
        size={48}
        className={darkMode ? "text-gray-600" : "text-blue-400"}
      />
    </div>
    <h3
      className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
    >
      All Caught Up!
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
      No patient records found for{" "}
      <span className="font-semibold text-blue-500">
        {dayjs(date).format("DD MMM YYYY")}
      </span>
      .
    </p>
  </motion.div>
);

const DoctorQueue = () => {
  const {
    queue = [],
    getQueue,
    user,
    getPatientSummary,
    submitConsultation,
  } = useAppStore();
  const { darkMode } = useStore();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openConsultation, setOpenConsultation] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [labAddons, setLabAddons] = useState([]);
  const [drugAddons, setDrugAddons] = useState([]);

  const [sendLab, setSendLab] = useState(false)
  const [sendPharmacy, setSendPharmacy] = useState(false)
  const [sendRadiology, setSendRadiology] = useState(false)
  const [sendAdmission, setSendAdmission] = useState(false)
  const [sendTheatre, setSendTheatre] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQueueId, setIsQueueId] = useState(null);
  const [activeVitalId, setActiveVitalId] = useState(null);

  const openVitalsModal = (q) => {
    setSelectedQueue(q);
    setVitalsModalOpen(true);
  };

  console.log("Current queue data in DoctorQueue:", queue);

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
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

      // Filter for Consultation stage if user is a doctor
      const matchesRole =
        user?.role === "doctor" ? q.currentStage === "CONSULTATION" : true;

      return (
        matchesDate && matchesSearch && matchesRole && q.status === "active"
      );
    });
  }, [queue, selectedDate, search, user?.role]);

  const getPatientVital = async (q) => {
    // setIsLoading(true);
    setActiveVitalId(q);

    if (!q) {
      console.warn("⚠️ No queue item provided");
      return;
    }

    try {
      // const queueId = q.queueId ;

      // console.log("🟡 Extracted queueId:", q);

      const summary = await getPatientSummary(q);

      // console.log("🟢 Raw Patient Summary Response:", summary);

      // console.log("🟢 Vitals Data Only:", summary?.vitals || summary);

      setSelectedQueue(q);
      setSummaryData(summary);
      setSummaryOpen(true);
    } catch (error) {
      console.error("🔴 Failed to fetch patient vitals:", error);
    } finally {
      //   setIsLoading(false);
      setActiveVitalId(null);
    }
  };

  const stats = {
    total: filteredData.length,
    consultation: filteredData.filter((q) => q.currentStage === "CONSULTATION")
      .length,
    urgent: filteredData.filter((q) => q.isUrgent).length,
  };

  const LAB_OPTIONS = [
    { name: "Malaria RDT", amount: 5500 },
    { name: "Full Blood Count (FBC)", amount: 4000 },
    { name: "Urinalysis", amount: 2500 },
    { name: "Liver Function Test", amount: 8000 },
    { name: "Kidney Function Test", amount: 7500 },
    { name: "Blood Glucose (FBS)", amount: 2000 },
    { name: "HIV Test", amount: 3000 },
    { name: "Pregnancy Test", amount: 1500 },
    { name: "Typhoid Test (Widal)", amount: 3000 },
    { name: "Lipid Profile", amount: 9000 },
    { name: "Electrolyte Panel", amount: 8500 },
    { name: "HbA1c", amount: 7000 },
  ];

  const DRUG_OPTIONS = [
    { name: "Paracetamol", amount: 1200 },
    { name: "Ibuprofen", amount: 1500 },
    { name: "Amoxicillin", amount: 2500 },
    { name: "Ciprofloxacin", amount: 3000 },
    { name: "Metronidazole", amount: 2000 },
    { name: "Artemether/Lumefantrine", amount: 3500 },
    { name: "Azithromycin", amount: 3500 },
    { name: "Diclofenac", amount: 1800 },
    { name: "Omeprazole", amount: 2200 },
    { name: "ORS", amount: 800 },
    { name: "Vitamin C", amount: 1000 },
  ];

  const addLab = (item) => {
    setLabAddons((prev) => {
      if (prev.find((x) => x.name === item.name)) return prev;
      return [...prev, { ...item, category: "LABORATORY" }];
    });
  };

  const addDrug = (item) => {
    setDrugAddons((prev) => {
      if (prev.find((x) => x.name === item.name)) return prev;
      return [...prev, { ...item, category: "PHARMACY" }];
    });
  };

  const removeLab = (name) => {
    setLabAddons((prev) => prev.filter((x) => x.name !== name));
  };

  // Calendar render logic for clean UI
  const fullCellRender = (date, info) => {
    if (info.type !== "date") return info.originNode;

    const dateStr = date.format("YYYY-MM-DD");
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === dayjs().format("YYYY-MM-DD");

    const hasPending = queue.some(
      (q) =>
        dayjs(q.createdAt).format("YYYY-MM-DD") === dateStr &&
        q.currentStage === "CONSULTATION" &&
        q.status === "active",
    );

    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected ? "!bg-blue-600 !text-white shadow-md" : ""}
            ${!isSelected && hasPending ? "bg-amber-50 text-amber-600 border border-amber-200 font-bold" : ""}
            ${!isSelected && isToday ? "border border-blue-500 text-blue-500 font-medium" : ""}
            ${!isSelected && !isToday && !hasPending ? (darkMode ? "text-gray-400" : "text-gray-700") : ""}
          `}
        >
          {date.date()}
          {hasPending && (isSelected || isToday) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
          )}
        </div>
      </div>
    );
  };

  const startConsultation = (q) => {
    // 1. Set the ID for submission
    setIsQueueId(q.queueId);

    // 2. Pre-populate or Reset Clinical Notes
    setClinicalNotes(q.clinicalNotes || "");

    // 3. Pre-populate or Reset Diagnosis
    setDiagnosis(q.diagnosis || "");

    // 4. Pre-populate Addons (Labs & Drugs)
    // If the backend returns existing items in 'items' or 'addons' array
    //   if (q.items && q.items.length > 0) {
    //     // const existingLabs = q.items.filter(item => item.category === "LABORATORY");
    //     const existingDrugs = q.items.filter(item => item.category === "PHARMACY");

    //     setLabAddons(existingLabs);
    //     setDrugAddons(existingDrugs);
    //   } else {
    //     setLabAddons([]);
    //     setDrugAddons([]);
    //   }

    // 5. Open the modal
    setOpenConsultation(true);
  };

  const handleSubmitConsultation = async () => {
    setIsSubmitting(true);
    try {
      if (!isQueueId) {
        console.error("❌ Missing queueId");
        return;
      }

      const payload = {
        clinicalNotes,
        diagnosis,
        addons: [...labAddons, ...drugAddons],
      };

      // console.log("🚀 Sending:", payload);

      // ✅ send to backend
      await submitConsultation(isQueueId, payload);

      toast.success("Consultation submitted successfully!");

      // ✅ refresh queue (optional but recommended)
      await getQueue(user?.role, selectedDate);

      // close modal
      setOpenConsultation(false);
    } catch (error) {
      toast.error(error.message || "Failed to submit consultation");
      console.error("❌ Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPdf = (url) => {
    setPdfUrl(url);
    setPdfOpen(true);
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh] flex flex-col transition-colors duration-300`}
    >
      <ToastContainer transition={Bounce} />

      <div
        className={`p-5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex justify-between items-center`}
      >
        <div>
          <h2 className="text-xl font-bold">Patient Queue</h2>
          <p className="text-xs text-gray-500">
            Manage and track consultation flow
          </p>
        </div>

        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"}`}
          >
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

      <div className="flex flex-1 overflow-hidden">
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
              fullCellRender={fullCellRender}
            />
          </ConfigProvider>

          <div
            className={`mt-6 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-slate-50 border-transparent"}`}
          >
            <p className="text-sm text-gray-500 mb-1">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-3xl font-bold">{stats.total} Queue</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  Consultation Needed
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? "bg-amber-900/40 text-amber-500" : "bg-amber-100 text-amber-600"}`}
                >
                  {stats.consultation}
                </span>
              </div>
              {stats.urgent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Urgent Cases</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-600">
                    {stats.urgent}
                  </span>
                </div>
              )}
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
              <div className="p-6">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center transition-all hover:shadow-md gap-4 ${darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${darkMode
                          ? "bg-blue-900/40 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                          }`}
                      >
                        {q.patientId?.firstName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base capitalize">
                            {q.patientId?.firstName} {q.patientId?.lastName}
                          </h4>
                          {q.isUrgent && (
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {q.reasonForVisit || "Consultation"} •{" "}
                          <span className="font-mono text-[10px]">
                            {q.queueId}
                          </span>
                        </p>

                        {/* REFINED LAB RESULT NOTIFICATION */}
                        {q?.labResults?.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg w-fit border ${darkMode
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Lab Results Ready • Resume Consultation
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      {q.status === "active" && (
                        <button
                          onClick={() => startConsultation(q)}
                          className="text-xs font-bold px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors active:scale-95 flex-1 md:flex-none"
                        >
                          {q?.labResults?.length > 0
                            ? "Resume Consultation"
                            : "Start Consultation"}
                        </button>
                      )}
                      <button
                        onClick={() => getPatientVital(q.queueId)}
                        className="text-xs font-bold px-4 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition-colors active:scale-95 flex items-center justify-center min-w-[110px] flex-1 md:flex-none"
                      >
                        {activeVitalId === q.queueId ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "View Summary"
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

      <Modal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        title="Patient Summary"
      >
        {summaryData && (
          <Tabs
            defaultActiveKey="1"
            items={[
              // ================= VITALS =================
              {
                key: "1",
                label: "Vitals",
                children: (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* TEMPERATURE */}
                    <div
                      className={`p-3 rounded-lg ${summaryData.currentVitals.temperature.value >= 38
                        ? "bg-red-100 text-red-700"
                        : summaryData.currentVitals.temperature.value >= 37
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      <p className="text-xs">Temperature</p>
                      <p className="font-bold">
                        {summaryData.currentVitals.temperature.value}°C
                      </p>
                    </div>

                    {/* BP */}
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                      <p className="text-xs">Blood Pressure</p>
                      <p className="font-bold">
                        {summaryData.currentVitals.bloodPressure.systolic}/
                        {summaryData.currentVitals.bloodPressure.diastolic}
                      </p>
                    </div>

                    {/* HEART RATE */}
                    <div
                      className={`p-3 rounded-lg ${summaryData.currentVitals.heartRate.value < 60 ||
                        summaryData.currentVitals.heartRate.value > 100
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      <p className="text-xs">Heart Rate</p>
                      <p className="font-bold">
                        {summaryData.currentVitals.heartRate.value} bpm
                      </p>
                    </div>

                    {/* SPO2 */}
                    <div
                      className={`p-3 rounded-lg ${summaryData.currentVitals.oxygenSaturation.value < 95
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      <p className="text-xs">SpO2</p>
                      <p className="font-bold">
                        {summaryData.currentVitals.oxygenSaturation.value}%
                      </p>
                    </div>

                    {/* BMI */}
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-700 col-span-2">
                      <p className="text-xs">BMI</p>
                      <p className="font-bold">
                        {summaryData.currentVitals.bmi}
                      </p>
                    </div>

                    {/* COMMENT */}
                    <div className="p-3 rounded-lg bg-gray-100 col-span-2">
                      <p className="text-xs text-gray-500">Doctor Comment</p>
                      <p className="font-semibold">
                        {summaryData.currentVitals.comment}
                      </p>
                    </div>
                  </div>
                ),
              },

              // ================= LAB RESULTS =================
              {
                key: "2",
                label: "Lab Results",
                children: (
                  <>
                    <Collapse
                      bordered={false}
                      items={summaryData.pastLabResults.map((lab, i) => ({
                        key: i,
                        label: (
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{lab.testName}</span>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {new Date(lab.createdAt).toLocaleDateString()}
                              </span>

                              {lab.fileUrl ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPdf(lab.fileUrl);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  📄
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No file
                                </span>
                              )}
                            </div>
                          </div>
                        ),

                        children: (
                          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
                            <p>
                              <span className="text-gray-500">Status:</span>{" "}
                              <span className="font-medium">{lab.status}</span>
                            </p>

                            <p>
                              <span className="text-gray-500">Result:</span>{" "}
                              <span className="font-semibold">
                                {lab.resultNote}
                              </span>
                            </p>

                            <p>
                              <span className="text-gray-500">Date:</span>{" "}
                              {new Date(lab.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ),
                      }))}
                    />

                    {/* PDF PREVIEW MODAL */}
                    <Modal
                      isOpen={pdfOpen}
                      onClose={() => setPdfOpen(false)}
                      title="Lab Result Preview"
                    >
                      {pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          className="w-full h-[80vh] rounded-lg border"
                        />
                      ) : (
                        <p>No file available</p>
                      )}
                    </Modal>
                  </>
                ),
              },
            ]}
          />
        )}
      </Modal>

      <Modal
        size="5xl"
        isOpen={openConsultation}
        onClose={() => setOpenConsultation(false)}
        title={
          clinicalNotes
            ? "Edit / Resume Consultation"
            : "New Consultation"
        }
      >
        <div className="space-y-6">

          {/* CLINICAL */}

          <div
            className={`rounded-2xl border p-5 ${darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
              }`}
          >

            <h3 className="font-bold mb-5">
              Clinical Assessment
            </h3>

            <div className="grid grid-cols-2 gap-5">

              <div>

                <label className="text-sm font-semibold">
                  Clinical Notes
                </label>

                <textarea
                  value={clinicalNotes}
                  onChange={(e) =>
                    setClinicalNotes(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="History, examination findings..."
                  className="w-full mt-2 px-4 py-3 rounded-xl border resize-none"
                />

              </div>

              <div>

                <label className="text-sm font-semibold">
                  Diagnosis
                </label>

                <textarea
                  value={diagnosis}
                  onChange={(e) =>
                    setDiagnosis(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder=" Primary diagnosis Secondary diagnosis"
                  className="w-full mt-2 px-4 py-3 rounded-xl border resize-none"
                />

              </div>

            </div>

          </div>


          {/* ORDER DESTINATION */}

          <div
            className={`rounded-2xl border p-5 ${darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-50 border-blue-100"
              }`}
          >

            <h3
              className="font-bold mb-5"
            >

              Department Orders

            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >

              <label
                className="flex items-center gap-2"
              >

                <input
                  type="checkbox"
                  checked={sendPharmacy}
                  onChange={() =>
                    setSendPharmacy(
                      !sendPharmacy
                    )
                  }
                />

                Pharmacy

              </label>


              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={sendLab}
                  onChange={() =>
                    setSendLab(
                      !sendLab
                    )
                  }
                />

                Laboratory

              </label>


              <label
                className="flexitems-center gap-2"
              >

                <input
                  type="checkbox"
                  checked={sendRadiology}
                  onChange={() =>
                    setSendRadiology(
                      !sendRadiology
                    )
                  }
                />

                Radiology

              </label>


              <label className="flex items-center gap-2"
              >

                <input
                  type="checkbox"
                  checked={sendAdmission}
                  onChange={() =>
                    setSendAdmission(
                      !sendAdmission
                    )
                  }
                />

                Admission

              </label>


              <label
                className="flex items-center gap-2"
              >

                <input
                  type="checkbox"
                  checked={sendTheatre}
                  onChange={() =>
                    setSendTheatre(
                      !sendTheatre
                    )
                  }
                />

                Theatre

              </label>

            </div>

          </div>


          {/* LAB */}

          {sendLab && (

            <div className={`rounded-2xl border p-5 ${darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-50 border-blue-100"
              }`}
            >

              <h3 className="font-bold mb-4"
              >

                Laboratory Request

              </h3>

              <select
                onChange={(e) => {

                  const selected =
                    LAB_OPTIONS.find(
                      x => x.name ===
                        e.target.value
                    )

                  if (selected)
                    addLab(selected)

                  e.target.value = ""

                }}
                className="w-full p-3 rounded-xl border"
              >

                <option>

                  Select Lab Test

                </option>

                {
                  LAB_OPTIONS.map(
                    lab => (

                      <option
                        key={lab.name}
                        value={lab.name}
                      >

                        {lab.name}

                      </option>

                    )
                  )
                }

              </select>

              <div
                className="space-y-2 mt-4"
              >

                {
                  labAddons.map(
                    item => (

                      <div
                        key={item.name}
                        className="flex justify-between bg-blue-100 rounded-xl p-3"
                      >

                        <span>

                          {item.name}

                        </span>

                        <button
                          onClick={() =>
                            removeLab(
                              item.name
                            )
                          }
                        >

                          ✕

                        </button>

                      </div>

                    )
                  )
                }

              </div>

            </div>

          )}


          {/* PHARMACY */}

          {sendPharmacy && (

            <div
              className={`rounded-2xl border p-5${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-emerald-50 border-emerald-100"
                }`}
            >

              <h3
                className="font-bold mb-4"
              >

                Prescription

              </h3>

              <PrescriptionSection />

            </div>

          )}


          {/* RADIOLOGY */}

          {sendRadiology && (

            <div
              className="
rounded-2xl
border
p-5
"
            >

              <h3
                className="
font-bold
mb-4
"
              >

                Radiology

              </h3>

              <div
                className="
grid
grid-cols-2
gap-4
"
              >

                <select
                  className="
p-3
border
rounded-xl
"
                >

                  <option>
                    X-Ray
                  </option>

                  <option>
                    CT Scan
                  </option>

                  <option>
                    MRI
                  </option>

                  <option>
                    Ultrasound
                  </option>

                </select>

                <select
                  className="
p-3
border
rounded-xl
"
                >

                  <option>

                    Routine

                  </option>

                  <option>

                    Urgent

                  </option>

                </select>

              </div>

              <textarea
                placeholder="
Clinical indication
"
                rows={3}
                className="
w-full
mt-4
border
rounded-xl
p-3
"
              />

            </div>

          )}


          {/* ADMISSION */}

          {sendAdmission && (

            <div
              className="
rounded-2xl
border
p-5
"
            >

              <h3
                className="
font-bold
mb-4
"
              >

                Admission

              </h3>

              <div
                className="
grid
grid-cols-2
gap-4
"
              >

                <select
                  className="
p-3
border
rounded-xl
"
                >

                  <option>
                    Medical Ward
                  </option>

                  <option>
                    Surgical Ward
                  </option>

                  <option>
                    ICU
                  </option>

                </select>

                <select
                  className="
p-3
border
rounded-xl
"
                >

                  <option>

                    Routine

                  </option>

                  <option>

                    Urgent

                  </option>

                </select>

              </div>

            </div>

          )}


          {/* SUMMARY */}

          <div
            className={`
rounded-2xl
border
p-5
${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
              }
`}
          >

            <h3
              className="
font-bold
mb-3
"
            >

              Order Summary

            </h3>

            <div
              className="
space-y-2
text-sm
"
            >

              {sendLab && (
                <div>
                  ✓ Laboratory
                </div>
              )}

              {sendPharmacy && (
                <div>
                  ✓ Pharmacy
                </div>
              )}

              {sendRadiology && (
                <div>
                  ✓ Radiology
                </div>
              )}

              {sendAdmission && (
                <div>
                  ✓ Admission
                </div>
              )}

              {sendTheatre && (
                <div>
                  ✓ Theatre
                </div>
              )}

            </div>

          </div>


          <div
            className="
flex
justify-end
pt-4
border-t
"
          >

            <button
              onClick={
                handleSubmitConsultation
              }
              disabled={
                isSubmitting
              }
              className="
bg-blue-600
hover:bg-blue-700
text-white
px-8
py-3
rounded-xl
font-bold
"
            >

              {
                isSubmitting
                  ?
                  "Submitting..."
                  :
                  "Complete Consultation"
              }

            </button>

          </div>

        </div>

      </Modal>
    </div>
  );
};

export default DoctorQueue;

import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { HiSearch, HiCalendar } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import CreateQueue from "../../components/CreateQueue";
import VitalsModal from "../../components/VitalsModal";

const PER_PAGE = 10;

const Queue = () => {
  const {
    queue = [],
    getQueue,
    cancelQueue,
    takeVitals,
    getPatientSummary,
    submitConsultation,
  } = useAppStore();

  const { darkMode } = useStore();
  const user = useAppStore((state) => state.user);

  // Default to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [openConsultation, setOpenConsultation] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const [labAddons, setLabAddons] = useState([]);
  const [drugAddons, setDrugAddons] = useState([]);

  const [labQuery, setLabQuery] = useState("");
  const [drugQuery, setDrugQuery] = useState("");

  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDragging = useRef(false);

  const [isQueueId, setIsQueueId] = useState(null);

  const [viewMode, setViewMode] = useState("today"); // "today" | "all"

  const statusStyles = (darkMode) => ({
    triage: darkMode
      ? "bg-amber-700 text-white"
      : "bg-amber-100 text-amber-700",
    "ready-for-doctor": darkMode
      ? "bg-indigo-700 text-white"
      : "bg-indigo-100 text-indigo-700",
    "in-progress": darkMode
      ? "bg-blue-700 text-white"
      : "bg-blue-100 text-blue-700",
    done: darkMode
      ? "bg-emerald-700 text-white"
      : "bg-emerald-100 text-emerald-700",
    cancelled: darkMode ? "bg-red-700 text-white" : "bg-red-100 text-red-700",
    "awaiting-payment": darkMode
      ? "bg-purple-700 text-white"
      : "bg-purple-100 text-purple-700",
    "partial-payment": darkMode
      ? "bg-yellow-700 text-white"
      : "bg-yellow-100 text-yellow-700",
  });

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

  const filteredLabs = LAB_OPTIONS.filter((l) =>
    l.name.toLowerCase().includes(labQuery.toLowerCase()),
  );

  const filteredDrugs = DRUG_OPTIONS.filter((d) =>
    d.name.toLowerCase().includes(drugQuery.toLowerCase()),
  );
  const removeDrug = (name) => {
    setDrugAddons((prev) => prev.filter((x) => x.name !== name));
  };

  const buildPayload = () => ({
    clinicalNotes,
    diagnosis,
    addons: [...labAddons, ...drugAddons],
  });

  /**
   * ✅ FETCH QUEUE
   * Triggered when: Role loads, Date changes, or component mounts
   */
  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      // We pass user?.role or fallback to what is in sessionStorage inside the store
      await getQueue(user?.role);
      setLocalLoading(false);
    };

    fetchData();
  }, [getQueue, selectedDate, user?.role]);

  const handleViewAll = async () => {
    setViewMode("all");
    await getQueue(user?.role); // ✅ no date at all
  };

  const handleToday = async () => {
    setViewMode("today");
    await getQueue(user?.role, selectedDate);
  };

  const getPatientName = (q) => {
    if (q.patientName) return q.patientName;
    if (q.patientId) {
      return `${q.patientId.firstName} ${q.patientId.lastName}`;
    }
    return "Unknown";
  };

  const openVitalsModal = (q) => {
    setSelectedQueue(q);
    setVitalsModalOpen(true);
  };

  // console.log(queue)

  const getPatientVital = async (q) => {
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  const startConsultation = (q) => {
    // set selected patient/queue
    setIsQueueId(q);

    // reset form
    setClinicalNotes("");
    setDiagnosis("");
    setLabAddons([]);
    setDrugAddons([]);

    // open modal
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
  // console.log(queue);

  const handleDateSelect = (value) => {
    setSelectedDate(value.format("YYYY-MM-DD"));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(queue)) return [];

    return queue
      .filter((q) =>
        viewMode === "all"
          ? true
          : dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate,
      )
      .filter((q) => {
        if (user?.role === "nurse") {
          return q.currentStage === "TRIAGE" || !q.currentStage;
        }
        return true;
      })
      .filter((q) =>
        getPatientName(q).toLowerCase().includes(search.toLowerCase()),
      )
      .filter((q) =>
        statusFilter === "All"
          ? true
          : q.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
  }, [queue, selectedDate, search, statusFilter, user?.role, viewMode]);

  // const filteredData = useMemo(() => {
  //     if (!Array.isArray(queue)) return [];

  //     return queue
  //       .filter((q) => dayjs(q.createdAt).format("YYYY-MM-DD") === selectedDate)
  //       .filter((q) => {
  //         if (user?.role === "nurse") {
  //           return q.currentStage === "TRIAGE" || !q.currentStage;
  //         }
  //         return true;
  //       })
  //       .filter((q) =>
  //         getPatientName(q).toLowerCase().includes(search.toLowerCase()),
  //       )
  //       .filter((q) =>
  //         statusFilter === "All"
  //           ? true
  //           : q.status?.toLowerCase() === statusFilter.toLowerCase(),
  //       );
  //   }, [queue, selectedDate, search, statusFilter, user?.role]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleMouseDown = () => {
    if (window.innerWidth >= 1024) isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setLeftWidth(Math.min(Math.max(e.clientX, 300), 500));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // const handleDateSelect = (value) => {
  //   setSelectedDate(value.format("YYYY-MM-DD"));
  //   setCurrentPage(1);
  // };

  const totalForDay = filteredData.length;
  const triage = filteredData.filter((q) => q.currentStage === "TRIAGE").length;
  const consultation = filteredData.filter(
    (q) => q.currentStage === "CONSULTATION",
  ).length;
  const laboratory = filteredData.filter(
    (q) => q.currentStage === "LABORATORY",
  ).length;
  const finance = filteredData.filter(
    (q) => q.currentStage === "FINANCE",
  ).length;

  /**
   * ✅ FILTER LOGIC
   * Matches date, role permissions, search string, and status
   */

  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh]`}
    >
      <ToastContainer />

      {/* TOPBAR / HEADER */}
      <div
        className={`p-5 border-b ${
          darkMode ? "border-gray-800" : "border-gray-100"
        } flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
      >
        <div>
          <h2 className="text-xl font-bold">Patient Queue</h2>
          <p className="text-xs text-gray-500">Manage and track patient flow</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* DATE SELECTOR */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <HiCalendar className="text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                handleToday(); // ✅ auto refresh when date changes
              }}
              className="bg-transparent text-sm outline-none cursor-pointer"
            />
          </div>

          {/* VIEW MODE BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewAll}
              className={`px-3 py-2 text-xs cursor-pointer font-medium transition ${
                viewMode === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              View All
            </button>

            <button
              onClick={handleToday}
              className={`px-3 py-2 text-xs cursor-pointer font-medium transition ${
                viewMode === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Today
            </button>
          </div>

          {user?.role === "record_officer" && (
            <button
              onClick={() => setIsQueueOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="p-5 flex justify-end">
        {user.role === "doctor" && (
       <div className="flex items-center gap-3 mr-5">
           <motion.button
            {...buttonMotion}
            // onClick={() => setIsAddModalOpen(true)}
            className={buttonStyle}
          >
            Awaiting Attention
          </motion.button>
          <motion.button
            {...buttonMotion}
            // onClick={() => setIsAddModalOpen(true)}
            className={buttonStyle}
          >
            Attended To Today
          </motion.button>
          <motion.button
            {...buttonMotion}
            // onClick={() => setIsAddModalOpen(true)}
            className={buttonStyle}
          >
            Currently In Lab
          </motion.button>
       </div>
        )}
        <div className="relative max-w-lg">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or queue ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-[500px] pl-10 pr-4 py-2.5 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} focus:ring-2 focus:ring-blue-500 outline-none`}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] gap-4">
        {/* calendar */}

        {/* <div
          // style={{ width: window.innerWidth < 1024 ? "100%" : leftWidth }}
          className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 overflow-y-auto`}
        > */}
        <div
          className={`w-full lg:w-95 shrink-0 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-4 rounded-xl overflow-y-auto`}
        >
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: {
                colorPrimary: "#3b82f6",
                colorBgContainer: darkMode ? "#1f2937" : "#ffffff",
                colorText: darkMode ? "#f9fafb" : "#111827",
                colorTextPlaceholder: darkMode ? "#d1d5db" : "#6b7280",
                colorFillAlter: darkMode ? "#374151" : "#f9fafb",
                colorTextLightSolid: darkMode ? "#f9fafb" : "#111827",
              },
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              dateFullCellRender={(value) => {
                const formattedDate = value.format("YYYY-MM-DD");
                const queueForDay = queue.filter(
                  (q) =>
                    dayjs(q.timeAdded).format("YYYY-MM-DD") === formattedDate,
                );
                const isSelected = formattedDate === selectedDate;

                return (
                  <div
                    className={`h-full flex flex-col items-center justify-center rounded-lg ${
                      isSelected
                        ? darkMode
                          ? "bg-blue-800 text-white"
                          : "bg-blue-600 text-white"
                        : queueForDay.length > 0
                          ? darkMode
                            ? "bg-blue-900/30"
                            : "bg-blue-50 text-blue-700"
                          : ""
                    }`}
                  >
                    <span>{value.date()}</span>

                    {queueForDay.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {queueForDay.slice(0, 3).map((q) => (
                          <span
                            key={q.id}
                            className={`w-2 h-2 rounded-full ${
                              statusStyles(darkMode)[q.status]?.split(" ")[0]
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </ConfigProvider>

          {/* SUMMARY */}
          <div
            className={`mt-6 p-4 rounded-xl ${
              darkMode ? "bg-gray-700" : "bg-slate-50"
            }`}
          >
            <p className="text-sm">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </p>
            <p className="text-2xl font-semibold mt-1">{totalForDay} Queue</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <span className="text-amber-500">{triage} Triage</span>
              <span className="text-blue-500">{consultation} Consultation</span>
              <span className="text-emerald-500">{laboratory} Laboratory</span>
              <span className="text-red-500">{finance} Finance</span>
            </div>
          </div>
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden lg:block w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize"
        />

        {/* QUEUE LISTING */}
        <div className="flex-1 px-5 pb-5 space-y-3 flex flex-col overflow-y-auto max-h-[calc(100vh-140px)]">
          {localLoading ? (
            /* ✅ ANTD SKELETON LOADERS */
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}
              >
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </div>
            ))
          ) : paginatedData.length === 0 ? (
            /* ✅ EMPTY STATE */
            <div className="py-20 text-center">
              <HiCalendar size={50} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                No patients found for{" "}
                {dayjs(selectedDate).format("DD MMM YYYY")}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {paginatedData.map((q) => (
                <motion.div
                  key={q._id || q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {getPatientName(q).charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
                            q.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {q.status}
                        </span>

                        <span className="text-[9px] font-bold uppercase px-2 py-0.5  bg-blue-50 text-blue-600">
                          {q.currentStage || "RECEPTION"}
                        </span>
                      </div>
                      <h4 className="font-semibold capitalize text-sm">
                        {getPatientName(q)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {q.reasonForVisit || "General Consultation"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {/* NURSE ACTION */}
                    {user?.role === "nurse" && q.currentStage === "TRIAGE" && (
                      <button
                        onClick={() => openVitalsModal(q)}
                        className="text-xs font-bold px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                      >
                        Process Vitals
                      </button>
                    )}

                    {/* DOCTOR ACTION */}
                    {user?.role === "doctor" && (
                      <div className="flex gap-2">
                        {q.status === "active" && (
                          <button
                            onClick={() => startConsultation(q.queueId)}
                            className="text-xs font-bold px-4 bg-blue-600 text-white py-2 cursor-pointer"
                          >
                            Start Consultation
                          </button>
                        )}
                        {/* {q.status === "active" && (
                        <button className="text-xs font-bold px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
                          <FaPaperPlane /> Consult
                        </button>
                      )} */}
                        {q.status === "active" && (
                          <button
                            onClick={() => {
                              getPatientVital(q.queueId);
                            }}
                            className="text-xs font-bold px-4 py-2 bg-purple-600 text-white cursor-pointer"
                          >
                            {isLoading ? "Loading..." : "View Summary"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* MODALS */}
      <Modal
        isOpen={vitalsModalOpen}
        onClose={() => setVitalsModalOpen(false)}
        title={
          <span className="capitalize">
            Patient Assessment: {selectedQueue?.patientId?.firstName || ""}
            &nbsp;
            {selectedQueue?.patientId?.lastName || ""}
          </span>
        }
      >
        <VitalsModal
          queueItem={selectedQueue}
          takeVitals={takeVitals}
          onClose={() => setVitalsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        title="New Queue Entry"
      >
        <CreateQueue onSuccess={() => setIsQueueOpen(false)} />
      </Modal>

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
                      className={`p-3 rounded-lg ${
                        summaryData.currentVitals.temperature.value >= 38
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
                      className={`p-3 rounded-lg ${
                        summaryData.currentVitals.heartRate.value < 60 ||
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
                      className={`p-3 rounded-lg ${
                        summaryData.currentVitals.oxygenSaturation.value < 95
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

                            <span className="text-xs text-gray-500">
                              {new Date(lab.createdAt).toLocaleDateString()}
                            </span>
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

                            {lab.fileUrl ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPdf(lab.fileUrl);
                                }}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer mt-2 p-0 -ml-1"
                              >
                                <img
                                  src="/assets/pdf_svg.svg"
                                  alt="PDF"
                                  className="w-10"
                                />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No file
                              </span>
                            )}
                          </div>
                        ),
                      }))}
                    />

                    {/* PDF PREVIEW MODAL */}
                    <Modal
                      isOpen={pdfOpen}
                      onClose={() => setPdfOpen(false)}
                      title="Lab Result Preview"
                      size="max-w-4xl"
                    >
                      {pdfUrl ? (
                        <iframe src={pdfUrl} className="w-full h-[80vh]" />
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
        isOpen={openConsultation}
        onClose={() => setOpenConsultation(false)}
        title="Submit Consultation"
      >
        <div className="space-y-5">
          {/* CLINICAL NOTES */}
          <div>
            <label className="text-sm font-semibold">Clinical Notes</label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg resize-none border-gray-300"
              placeholder="Write clinical notes..."
            />
          </div>

          {/* DIAGNOSIS */}
          <div>
            <label className="text-sm font-semibold">Diagnosis</label>
            <input
              value={diagnosis}
              rows={2}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg resize-none border-gray-300"
              placeholder="Enter diagnosis"
            />
          </div>

          {/* LAB TESTS */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Lab Tests</h3>

            <select
              onChange={(e) => {
                const selected = LAB_OPTIONS.find(
                  (l) => l.name === e.target.value,
                );
                if (selected) addLab(selected);
                e.target.value = ""; // reset after select
              }}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select lab test...
              </option>

              {LAB_OPTIONS.map((lab) => (
                <option key={lab.name} value={lab.name}>
                  {lab.name} - ₦{lab.amount}
                </option>
              ))}
            </select>

            <div className="mt-3 space-y-2">
              {labAddons.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center bg-blue-50 p-2 rounded-lg text-sm"
                >
                  <span>
                    {item.name} - ₦{item.amount}
                  </span>
                  <button
                    onClick={() => removeLab(item.name)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DRUGS */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Drugs</h3>

            <select
              onChange={(e) => {
                const selected = DRUG_OPTIONS.find(
                  (d) => d.name === e.target.value,
                );
                if (selected) addDrug(selected);
                e.target.value = ""; // reset
              }}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select drug...
              </option>

              {DRUG_OPTIONS.map((drug) => (
                <option key={drug.name} value={drug.name}>
                  {drug.name} - ₦{drug.amount}
                </option>
              ))}
            </select>

            <div className="mt-3 space-y-2">
              {drugAddons.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center bg-purple-50 p-2 rounded-lg text-sm"
                >
                  <span>
                    {item.name} - ₦{item.amount}
                  </span>
                  <button
                    onClick={() => removeDrug(item.name)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="text-sm font-semibold flex justify-between border-gray-200 border-t pt-3">
            <span>Total</span>
            <span>
              ₦
              {[...labAddons, ...drugAddons].reduce(
                (sum, i) => sum + i.amount,
                0,
              )}
            </span>
          </div>

          {/* SUBMIT */}

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
              {isSubmitting ? "Submitting..." : "Submit Consultation"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Queue;

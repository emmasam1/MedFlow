import React, { useState, useMemo, useRef, useEffect } from "react";
import { FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";
import {
  PlusCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { BsQrCodeScan } from "react-icons/bs";
import { LiaFilterSolid } from "react-icons/lia";
import AddPatients from "../components/AddPatients";
import Modal from "../components/Modal";
import { useStore } from "../store/store";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { Tooltip } from "antd";

const Table = ({
  columns,
  data,
  searchableKeys = [],
  actions,
  pageSize = 10,
  onRowClick,
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { darkMode } = useStore();
  const { patients } = useAppStore();
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    );
    audio.play();
  };

  const extractPatientId = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      return parsed.id?.trim() || null; // ✅ Only return ID
    } catch {
      return null; // Not JSON
    }
  };

  /* -------------------- QR SCANNER -------------------- */
  const startScanner = async () => {
    if (isScanning) return;

    // Use the ID directly to ensure the element exists
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;
    setIsScanning(true);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 150, height: 150 } },
        (decodedText) => {
          if (scanSuccess) return;
          const cardNumber = extractPatientId(decodedText);
          handleScanSuccess(cardNumber);
        },
      );
    } catch (err) {
      console.error("Camera error:", err);
      setIsScanning(false); // Reset if it fails to start
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Stop error:", err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const scanBlockedRef = useRef(false); // 🚨 Blocks multiple scans

  const handleScanSuccess = async (patientId) => {
    if (!patientId || scanBlockedRef.current) return; // block duplicates

    scanBlockedRef.current = true; // immediately block further scans

    // Stop the scanner before doing anything else
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Scanner stop error:", err);
      }
      scannerRef.current = null;
      setIsScanning(false);
    }

    // Now play beep and navigate
    playBeep();
    setIsScanOpen(false); // close modal

    // Give a tiny delay to ensure modal closes before navigating
    setTimeout(() => {
      navigate(`/dashboard/patient-profile/${patientId}`);
    }, 100);
  };

  // Reset scan block whenever a new scan session starts
  useEffect(() => {
    if (isScanOpen) {
      scanBlockedRef.current = false;
      startScanner();
    } else {
      stopScanner();
    }
  }, [isScanOpen]);

  // store visible column keys
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.key),
  );

  const filterRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowColumnFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((colKey) => colKey !== key)
        : [...prev, key],
    );
  };

  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  // 🔍 Search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      searchableKeys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, data, searchableKeys]);

  // 🔃 Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      {/* <div className="flex justify-between items-center">
          <div className="relative w-80">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div> */}

      {/* ================= TOP BAR ================= */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="font-semibold text-gray-800">All Patients</span>
          <span className="mx-2">›</span>
          <HomeIcon className="w-4 h-4" />
          <span className="mx-2">›</span>
          Patients
          <span className="mx-2">›</span>
          All Patients
        </div>

        {/* Toolbar Container */}
        <div className="bg-[#eef2fb] rounded-xl px-6 py-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-800">Patients</h2>

            {/* Search */}
            <div className="relative">
              <FiSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* Column Filter */}
            <div className="relative" ref={filterRef}>
              <Tooltip title="Show / Hide Columns">
                <LiaFilterSolid
                  onClick={() => setShowColumnFilter((prev) => !prev)}
                  className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 hover:scale-110 transition"
                />
              </Tooltip>

              {showColumnFilter && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Show / Hide Columns
                  </h4>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        {col.title}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Tooltip title="Add New Patient">
              <PlusCircleIcon
                onClick={() => setIsOpen(true)}
                className="w-6 h-6 text-green-600 cursor-pointer hover:scale-110 transition"
              />
            </Tooltip>

            <Tooltip title="Scan Patient QR Code">
              <BsQrCodeScan
                onClick={() => setIsScanOpen(true)}
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition"
              />
            </Tooltip>
            <ArrowPathIcon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition" />

            <ArrowDownTrayIcon className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800 transition" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className=" border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left font-medium">S/N</th>

                {filteredColumns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && requestSort(col.key)}
                    className={`px-6 py-4 text-left font-medium ${
                      col.sortable
                        ? "cursor-pointer hover:text-blue-600 select-none"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.title}
                      {sortConfig?.key === col.key &&
                        (sortConfig.direction === "asc" ? (
                          <FiChevronUp size={14} />
                        ) : (
                          <FiChevronDown size={14} />
                        ))}
                    </div>
                  </th>
                ))}

                {actions && (
                  <th className="px-6 py-4 text-center font-medium">Action</th>
                )}
              </tr>
            </thead>

            {/* Softer Row Dividers */}
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className="hover:bg-gray-50/60 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-500">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {filteredColumns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-6 py-4 flex justify-center gap-4">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-500">
          Showing page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Prev
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= MODAL ADD PATIENT ================= */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2
          className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          Patient Registration
        </h2>
        <AddPatients />
      </Modal>

      {/* ---------------- QR MODAL ---------------- */}
      <Modal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        title="Scan Patient QR Code"
        size="md"
      >
        <div className="relative">
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />

          {scanSuccess && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center animate-pulse">
              <FaCheckCircle size={80} className="text-white" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Table;

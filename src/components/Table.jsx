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
import { Tooltip } from "antd";
import XLSX from 'xlsx-js-style';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';


const Table = ({
  columns,
  data,
  searchableKeys = [],
  actions,
  defaultPageSize = 10,
  onRowClick,
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false)

  //select all rows
  const [selectedRows, setSelectedRows] = useState(new Set());


  const { darkMode } = useStore();
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const scanBlockedRef = useRef(false);

  const [refreshKey, setRefreshKey] = useState(0)

  const playBeep = () =>
    new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    ).play();

  const extractPatientId = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      return parsed.id?.trim() || null;
    } catch {
      return null;
    }
  };

  const startScanner = async () => {
    if (isScanning) return;
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;
    setIsScanning(true);
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 150, height: 150 } },
        (decodedText) => {
          if (scanBlockedRef.current) return;
          const cardNumber = extractPatientId(decodedText);
          handleScanSuccess(cardNumber);
        },
      );
    } catch {
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (patientId) => {
    if (!patientId || scanBlockedRef.current) return;
    scanBlockedRef.current = true;
    await stopScanner();
    playBeep();
    setIsScanOpen(false);
    setTimeout(() => navigate(`/dashboard/patient-profile/${patientId}`), 100);
  };

  useEffect(() => {
    if (isScanOpen) {
      scanBlockedRef.current = false;
      startScanner();
    } else stopScanner();
  }, [isScanOpen]);

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.key),
  );
  const filterRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowColumnFilter(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key) =>
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      searchableKeys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, data, searchableKeys]);

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

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const newSelection = new Set(paginatedData.map(row => row.id));
      setSelectedRows(newSelection);
    }
  }

  //Excell download with selection logic
  const handleDownloadExcel = async () => {
    //decide what to export:selection or everything filtered

    console.log("Download Button Clicked");
    console.log("Data to Export:", sortedData)

    const dataToExport = selectedRows.size > 0
      ? sortedData.filter(row => selectedRows.has(row.id))
      : sortedData;

    if (dataToExport.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsDownloading(true);
    const loadingToast = toast.loading(`Exporting ${dataToExport.length} rows...`);

    setTimeout(() => {
      try {
        const fileName = `Patients_Export_${format(new Date(), 'MMM_dd_HHmm')}.xlsx`;
        const excelColumns = columns.filter(col => col.key !== 'actions');
        const headers = ["S/N", ...excelColumns.map(col => col.title)];

        const excelRows = dataToExport.map((row, idx) => [
          idx + 1,
          ...excelColumns.map(col => row[col.key] || "")
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelRows]);

        //Styling Headers
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (!worksheet[address]) continue;

          worksheet[address].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1E293B" } },
            alignment: { horizontal: "center" }
          };
        }

        worksheet['!cols'] = [{ wch: 6 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 8 }, { wch: 20 }, { wch: 12 }];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
        XLSX.writeFile(workbook, fileName);

        toast.success("Download Successful", { id: loadingToast });
        setSelectedRows(new Set()); //Clear selection after download
      } catch (error) {
        toast.error("Export failed", { id: loadingToast });
      } finally {
        setIsDownloading(false)
      }
    }, 800);
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} space-y-6 p-4 rounded-lg`}
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-3 gap-2">
        <span className="font-semibold">Dashboard</span>
        <HomeIcon className="w-4 h-4" />
        <span>Patients</span>
      </div>

      {/* Toolbar */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-[#eef2fb]"} rounded-xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4`}
      >
        {/* Left: Title + Search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h2 className="text-lg font-semibold">Patients</h2>
          <div className="relative w-full md:w-64">
            <FiSearch className="w-5 h-5 absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-500 text-gray-900 placeholder-gray-500"} w-full pl-10 pr-4 py-1.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            />
          </div>
        </div>

        {/* Right: Actions + Filters */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={filterRef}>
            <Tooltip title="Show / Hide Columns">
              <LiaFilterSolid
                onClick={() => setShowColumnFilter((prev) => !prev)}
                className="w-6 h-6 cursor-pointer hover:text-blue-500 transition"
              />
            </Tooltip>
            {showColumnFilter && (
              <div
                className={`${darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-100"} absolute right-0 mt-3 w-64 rounded-2xl shadow-xl border p-4 z-50`}
              >
                <h4 className="text-sm font-semibold mb-3">
                  Show / Hide Columns
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-600/20 transition"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="w-4 h-4 accent-blue-500"
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
              className="w-6 h-6 text-green-500 cursor-pointer hover:scale-110 transition"
            />
          </Tooltip>

          <Tooltip title="Scan Patient QR Code">
            <BsQrCodeScan
              onClick={() => setIsScanOpen(true)}
              className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
            />
          </Tooltip>

          <Tooltip title="Refresh Table">
            <ArrowPathIcon
              onClick={() => {
                handleRefresh()
              }}
              className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
            />
          </Tooltip>

          {/* <Tooltip title={selectedRows.size > 0 ? "Download Selected" : "Download All"}>
            <div className="relative cursor-pointer" onClick={handleDownloadExcel}>
              {isDownloading ? (
                <ArrowPathIcon className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-600 transition animate-spin" />

              ) : (
                <>
                  <ArrowDownTrayIcon className="w-5 h-5 text-blue-500 hover:scale-110 transition" />
                  {selectedRows.size > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                      {selectedRows.size}
                    </span>
                  )}
                </>
              )}

            </div>

          </Tooltip> */}

          <Tooltip title="Download Excel">
            <div className="p-1 cursor-pointer" onClick={handleDownloadExcel}>
              {isDownloading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5 text-blue-500 hover:text-blue-600 transition" />
              )}
            </div>
          </Tooltip>

        </div>
      </div>

      {/* Table */}
      <div key={refreshKey}
        className={`${darkMode ? "border-gray-700" : "border-gray-100"} border overflow-x-auto rounded-lg`}
      >
        <table className="min-w-full text-sm">
          <thead
            className={`${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-500"} uppercase text-xs tracking-wider`}
          >
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                  // Checks if every row on the current page is selected
                  checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id))}
                  onChange={() => {
                    const allPageIds = paginatedData.map(row => row.id);
                    const isAllOnPageSelected = allPageIds.every(id => selectedRows.has(id));
                    const newSelection = new Set(selectedRows);

                    if (isAllOnPageSelected) {
                      allPageIds.forEach(id => newSelection.delete(id));
                    } else {
                      allPageIds.forEach(id => newSelection.add(id));
                    }
                    setSelectedRows(newSelection);
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left">S/N</th>
              {filteredColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && requestSort(col.key)}
                  className={`px-6 py-3 text-left ${col.sortable ? "cursor-pointer hover:text-blue-500" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {sortConfig?.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      ))}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>

          <tbody
            className={`${darkMode ? "divide-gray-700" : "divide-gray-100"} divide-y`}
          >
            {paginatedData.map((row, idx) => (
              <tr
                key={row.id}
                className={`${selectedRows.has(row.id) ? (darkMode ? "bg-blue-900/20" : "bg-blue-50") : ""} hover:${darkMode ? "bg-gray-800" : "bg-gray-50"} transition-colors cursor-pointer`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                    checked={selectedRows.has(row.id)}
                    onChange={() => {
                      const newSelection = new Set(selectedRows);
                      if (newSelection.has(row.id)) newSelection.delete(row.id);
                      else newSelection.add(row.id);
                      setSelectedRows(newSelection);
                    }}
                  />
                </td>

                <td className="px-6 py-3">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                {filteredColumns.map((col) => (
                  <td key={col.key} className="px-6 py-3">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-3 flex justify-center gap-2">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + PageSize */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-2 gap-2 text-sm">
        <p>
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded border ${darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} disabled:opacity-40`}
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded border ${darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} disabled:opacity-40`}
          >
            Next
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`border px-2 py-1 rounded ${darkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Patient"
      >
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

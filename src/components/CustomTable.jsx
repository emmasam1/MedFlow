import React, { useState, useMemo, useRef } from "react";
import { FiChevronUp, FiChevronDown, FiSearch, FiFilter } from "react-icons/fi";
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { LiaFilterSolid } from "react-icons/lia";
import { useStore } from "../store/store";
import { Tooltip } from "antd";
import XLSX from "xlsx-js-style";
import toast from "react-hot-toast";
import { format } from "date-fns";

const CustomTable = ({
  title = "Records",
  columns = [],
  data = [],
  searchableKeys = [],
  actions,
  extraToolbarActions,
  defaultPageSize = 10,
  onRowClick,
  onRefresh,
  exportFileName = "Export",
  breadcrumb = [],
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const { darkMode } = useStore();
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.key),
  );

  // --- Logic ---
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      searchableKeys.some((key) =>
        String(item[key] || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
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

  const handleDownloadExcel = () => {
    const dataToExport =
      selectedRows.size > 0
        ? data.filter((row) => selectedRows.has(row.id))
        : sortedData;

    if (dataToExport.length === 0) return toast.error("No data to export");

    setIsDownloading(true);
    try {
      const fileName = `${exportFileName}_${format(new Date(), "MMM_dd_HHmm")}.xlsx`;
      const excelColumns = columns.filter(
        (col) => col.key !== "actions" && visibleColumns.includes(col.key),
      );
      const headers = ["S/N", ...excelColumns.map((col) => col.title)];
      const excelRows = dataToExport.map((row, idx) => [
        idx + 1,
        ...excelColumns.map((col) => row[col.key] || ""),
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelRows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, fileName);
      toast.success("Exported Successfully");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center text-xs gap-2 opacity-60 ml-1">
          <HomeIcon className="w-3.5 h-3.5" />
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              <span>/</span>
              <span
                className={index === breadcrumb.length - 1 ? "font-bold" : ""}
              >
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Toolbar Area */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} p-4 flex flex-wrap justify-between items-center gap-4`}
      >
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="relative max-w-xs w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-9 pr-4 py-1.5 border text-sm outline-none transition
                ${darkMode ? "bg-gray-700 border-gray-600 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500 text-gray-900"}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {extraToolbarActions}

          {/* Column Filter Dropdown */}
          <div className="relative">
            <Tooltip title="Filter Columns">
              <FiFilter
                onClick={() => setShowColumnFilter(!showColumnFilter)}
                className={showColumnFilter ? "text-blue-500 cursor-pointer" : "text-gray-500 cursor-pointer"}
                size={18}
              />
            </Tooltip>
            {showColumnFilter && (
              <div
                className={`absolute right-0 mt-2 w-48  shadow-xl z-50 p-2 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <p className="text-[10px] font-bold uppercase p-2 opacity-50">
                  Visible Columns
                </p>
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => {
                        setVisibleColumns((prev) =>
                          prev.includes(col.key)
                            ? prev.filter((k) => k !== col.key)
                            : [...prev, col.key],
                        );
                      }}
                    />
                    {col.title}
                  </label>
                ))}
              </div>
            )}
          </div>

          <Tooltip title="Refresh List">
            <ArrowPathIcon
              onClick={onRefresh}
              className="w-5 h-5 cursor-pointer hover:text-blue-500 transition opacity-70"
            />
          </Tooltip>
          <Tooltip title="Export Excel">
            <button onClick={handleDownloadExcel} disabled={isDownloading}>
              <ArrowDownTrayIcon
                className={`w-5 h-5 transition ${isDownloading ? "animate-bounce" : "text-blue-500 hover:scale-110"}`}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Table Container */}
      <div
        className={`overflow-x-auto border border-gray-50 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} `}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`${darkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-50 text-gray-500"} uppercase text-[11px] font-bold tracking-wider`}
            >
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={() => {
                    if (selectedRows.size === paginatedData.length)
                      setSelectedRows(new Set());
                    else
                      setSelectedRows(new Set(paginatedData.map((r) => r.id)));
                  }}
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.size === paginatedData.length
                  }
                  className="accent-blue-500"
                />
              </th>
              <th className="px-4 py-3">S/N</th>
              {columns
                .filter((c) => visibleColumns.includes(c.key))
                .map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    {col.title}
                  </th>
                ))}
              {actions && <th className="px-4 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody
            className={`text-sm ${darkMode ? "divide-gray-700" : "divide-gray-100"} divide-y`}
          >
            {paginatedData.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`${darkMode ? "hover:bg-gray-700/40" : "hover:bg-gray-50"} transition-colors cursor-pointer 
                  ${selectedRows.has(row.id) ? (darkMode ? "bg-blue-900/20" : "bg-blue-50/50") : ""}`}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => {
                      const newSet = new Set(selectedRows);
                      newSet.has(row.id)
                        ? newSet.delete(row.id)
                        : newSet.add(row.id);
                      setSelectedRows(newSet);
                    }}
                    className="accent-blue-500"
                  />
                </td>
                <td className="px-4 py-3 font-medium opacity-60">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                {columns
                  .filter((c) => visibleColumns.includes(c.key))
                  .map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                {actions && (
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-2 py-3 gap-4">
        <div className="flex items-center gap-4 text-xs opacity-70">
          <span>Total: {filteredData.length} records</span>
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`bg-transparent border rounded p-1 outline-none ${darkMode ? "border-gray-700" : "border-gray-300"}`}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`p-2 rounded-lg border transition ${darkMode ? "border-gray-700 hover:bg-gray-700 disabled:opacity-20" : "border-gray-200 hover:bg-gray-100 disabled:opacity-30"}`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <div className="flex gap-1 mx-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : `${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`p-2 rounded-lg border transition ${darkMode ? "border-gray-700 hover:bg-gray-700 disabled:opacity-20" : "border-gray-200 hover:bg-gray-100 disabled:opacity-30"}`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;

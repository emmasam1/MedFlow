import React, { useState, useMemo } from "react";
import { FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

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
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
      
                {/* Right Icons */}
                <div className="flex items-center gap-5">
                  <FunnelIcon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition" />
      
                  <PlusCircleIcon
                    onClick={() => setIsOpen(true)}
                    className="w-6 h-6 text-green-600 cursor-pointer hover:scale-110 transition"
                  />
      
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

                {columns.map((col) => (
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

                  {columns.map((col) => (
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
    </div>
  );
};

export default Table;

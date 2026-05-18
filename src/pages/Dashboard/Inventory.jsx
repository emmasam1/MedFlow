import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineClipboardList } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tag, Tooltip, Select } from "antd";
import StatCard from "../../components/StatCard";
import CustomTable from "../../components/CustomTable"; // Adjust path as needed
import { useStore } from "../../store/store";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../../components/Modal";


const INITIAL_INVENTORY = [
  {
    id: "INV-001",
    name: "Paracetamol 500mg",
    category: "Drugs",
    stock: 450,
    unit: "Pack",
    price: 12.0,
  },
  {
    id: "INV-002",
    name: "Surgical Gloves (M)",
    category: "Medical Supplies",
    stock: 12,
    unit: "Box",
    price: 25.0,
  },
  {
    id: "INV-003",
    name: "Digital Thermometer",
    category: "Equipment",
    stock: 0,
    unit: "Unit",
    price: 45.0,
  },
  {
    id: "INV-004",
    name: "Amoxicillin Syrup",
    category: "Drugs",
    stock: 85,
    unit: "Bottle",
    price: 18.5,
  },
  {
    id: "INV-005",
    name: "Face Masks (N95)",
    category: "Medical Supplies",
    stock: 500,
    unit: "Box",
    price: 60.0,
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [filterCategory, setFilterCategory] = useState("All");
  const { darkMode } = useStore();
  const user = useAppStore((state) => state.user);
  const [addItemModal, setAddItemModal] = useState(false);
  const [itemCategory, setItemCategory] = useState()
  const [dosageForm, setDosageForm] = useState("");
  const [route, setRoute] = useState("");

  const buttonMotion = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  // Logic to determine status badge color
  const getStatusTag = (stock) => {
    if (stock <= 0) return <Tag color="error">Out of Stock</Tag>;
    if (stock <= 20) return <Tag color="warning">Low Stock</Tag>;
    return <Tag color="success">In Stock</Tag>;
  };

  // Table Column Definitions
  const columns = [
    {
      title: "Item Details",
      key: "name",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-bold">{record.name}</span>
          <span className="text-[10px] opacity-50 font-mono">{record.id}</span>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (cat) => (
        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-[11px] font-bold uppercase">
          {cat}
        </span>
      ),
    },
    {
      title: "Stock Level",
      key: "stock",
      render: (stock, record) => (
        <div className="flex items-center gap-3">
          <span className={`font-bold ${stock === 0 ? "text-red-500" : ""}`}>
            {stock} {record.unit}(s)
          </span>
          {getStatusTag(stock)}
        </div>
      ),
    },
    {
      title: "Unit Price",
      key: "price",
      render: (price) => <span className="font-bold">${price.toFixed(2)}</span>,
    },
  ];

  const statData = [
    { title: "Total Items", value: inventory.length, color: "blue" },
    {
      title: "Low Stock Alerts",
      value: inventory.filter((i) => i.stock > 0 && i.stock <= 20).length,
      color: "yellow",
    },
    {
      title: "Out of Stock",
      value: inventory.filter((i) => i.stock === 0).length,
      color: "red",
    },
  ];

  // Apply Category Filter before passing to table
  const displayData = useMemo(() => {
    return filterCategory === "All"
      ? inventory
      : inventory.filter((item) => item.category === filterCategory);
  }, [inventory, filterCategory]);


  const openItemModal = () => {
    setAddItemModal(true)
  }

  const dosageRouteMap = {
    Tablet: "Oral",
    Capsule: "Oral",
    Syrup: "Oral",
    Suspension: "Oral",

    Injection: "IV",

    Cream: "Topical",
    Ointment: "Topical",
    Lotion: "Topical",

    Suppository: "Rectal",

    Inhaler: "Inhalation",

    "Eye Drops": "Ophthalmic",
    "Ear Drops": "Otic",

    Pessary: "Vaginal",
  };

  return (
    <div className="">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2
            className={`text-2xl font-black flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            <HiOutlineClipboardList className="text-blue-600" />
            Store Inventory
          </h2>
          <p className="text-gray-500 text-sm">
            Manage medical supplies, drugs, and hospital equipment.
          </p>
        </div>

        {user.role === "store_officer" && (
          <div className="flex items-center gap-3">
            <motion.button {...buttonMotion} className={buttonStyle} onClick={() => openItemModal()}>
              <HiOutlinePlus /> Add New Item
            </motion.button>
          </div>
        )}
      </div>

      {/* ANALYTICS PREVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* CUSTOM TABLE INTEGRATION */}
      <CustomTable
        title="Inventory List"
        columns={columns}
        data={displayData}
        searchableKeys={["name", "id", "category"]}
        // breadcrumb={["Dashboard", "Inventory", "Store Items"]}
        onRefresh={() => console.log("Refreshing...")}
        exportFileName="Hospital_Inventory"
        extraToolbarActions={
          <Select
            defaultValue="All"
            style={{ width: 160 }}
            onChange={setFilterCategory}
            className={darkMode ? "ant-select-dark" : ""}
            options={[
              { value: "All", label: "All Categories" },
              { value: "Drugs", label: "Drugs" },
              { value: "Medical Supplies", label: "Medical Supplies" },
              { value: "Equipment", label: "Equipment" },
            ]}
          />
        }
        actions={
          user?.role === "store_officer"
            ? (row) => (
              <div className="flex gap-2">
                <Tooltip title="Edit">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
                    <FiEdit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip title="Delete">
                  <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
                    <FiTrash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            )
            : undefined
        }
      />




      <Modal
        size="2xl"
        isOpen={addItemModal}
        onClose={() => setAddItemModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
              <HiOutlinePlus className="text-blue-600 text-xl" />
            </div>

            <div>
              <h2 className="font-black text-lg">
                Add Store Item
              </h2>

              <p className="text-xs text-gray-500">
                Enterprise Hospital Inventory Management
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">

          {/* BASIC INFORMATION */}
          <div
            className={`rounded-2xl border p-5 ${darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
              }`}
          >
            <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-5">

              {/* Item Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Item Name
                </label>

                <input
                  type="text"
                  placeholder="Enter item name"
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Category
                </label>

                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <option value="">Select Category</option>
                  <option value="DRUGS">Drugs</option>
                  <option value="MEDICAL_CONSUMABLES">
                    Medical Consumables
                  </option>
                  <option value="LABORATORY">Laboratory</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="THEATRE">Theatre</option>
                  <option value="RADIOLOGY">Radiology</option>
                  <option value="BLOOD_BANK">Blood Bank</option>
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  SKU / Item Code
                </label>

                <input
                  type="text"
                  placeholder="INV-001"
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Unit Type
                </label>

                <select
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <option>Pack</option>
                  <option>Bottle</option>
                  <option>Box</option>
                  <option>Piece</option>
                  <option>Unit</option>
                  <option>Carton</option>
                </select>
              </div>

            </div>
          </div>

          {/* INVENTORY DETAILS */}
          <div
            className={`rounded-2xl border p-5 ${darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
              }`}
          >
            <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
              Inventory Details
            </h3>

            <div className="grid grid-cols-3 gap-5">

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  placeholder="0"
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Cost Price
                </label>

                <input
                  type="number"
                  placeholder="0.00"
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Selling Price
                </label>

                <input
                  type="number"
                  placeholder="0.00"
                  className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>

            </div>
          </div>

          {/* DRUG-SPECIFIC SECTION */}
          {/* {itemCategory === "DRUGS" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-emerald-50 border-emerald-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Drug Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    placeholder="BATCH-2026"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Dosage Form
                  </label>

                  <select
                    value={dosageForm}
                    onChange={(e) => {
                      const selectedForm = e.target.value;

                      setDosageForm(selectedForm);

                      // Auto-suggest route
                      setRoute(dosageRouteMap[selectedForm] || "");
                    }}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Dosage Form</option>

                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Injection">Injection</option>

                    <option value="Cream">Cream</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Lotion">Lotion</option>

                    <option value="Suppository">Suppository</option>

                    <option value="Inhaler">Inhaler</option>

                    <option value="Eye Drops">Eye Drops</option>
                    <option value="Ear Drops">Ear Drops</option>

                    <option value="Pessary">Pessary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Route
                  </label>

                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Route</option>

                    <option value="Oral">Oral</option>
                    <option value="IV">IV</option>
                    <option value="IM">IM</option>

                    <option value="Subcutaneous">Subcutaneous</option>

                    <option value="Topical">Topical</option>

                    <option value="Inhalation">Inhalation</option>

                    <option value="Ophthalmic">Ophthalmic</option>

                    <option value="Otic">Otic</option>

                    <option value="Rectal">Rectal</option>

                    <option value="Vaginal">Vaginal</option>

                    <option value="Sublingual">Sublingual</option>
                  </select>
                </div>


                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Strength
                  </label>

                  <input
                    type="text"
                    placeholder="500mg"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

              </div>
            </div>
          )} */}

          {/* DRUG-SPECIFIC SECTION */}
          {itemCategory === "DRUGS" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-emerald-50 border-emerald-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Drug Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Batch */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    placeholder="BATCH-2026"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Dosage Form */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Dosage Form
                  </label>

                  <select
                    value={dosageForm}
                    onChange={(e) => {
                      const selectedForm = e.target.value;

                      setDosageForm(selectedForm);

                      const routeMap = {
                        Tablet: "Oral",
                        Capsule: "Oral",
                        Syrup: "Oral",
                        Suspension: "Oral",

                        Injection: "IV",

                        Cream: "Topical",
                        Ointment: "Topical",

                        Suppository: "Rectal",

                        Inhaler: "Inhalation",

                        "Eye Drops": "Ophthalmic",
                        "Ear Drops": "Otic",
                      };

                      setRoute(routeMap[selectedForm] || "");
                    }}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Dosage Form</option>

                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>

                    <option value="Syrup">Syrup</option>
                    <option value="Suspension">Suspension</option>

                    <option value="Injection">Injection</option>

                    <option value="Cream">Cream</option>
                    <option value="Ointment">Ointment</option>

                    <option value="Suppository">Suppository</option>

                    <option value="Inhaler">Inhaler</option>

                    <option value="Eye Drops">Eye Drops</option>
                    <option value="Ear Drops">Ear Drops</option>
                  </select>
                </div>

                {/* Route */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Route
                  </label>

                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Route</option>

                    <option value="Oral">Oral</option>
                    <option value="IV">IV</option>
                    <option value="IM">IM</option>

                    <option value="Subcutaneous">Subcutaneous</option>

                    <option value="Topical">Topical</option>

                    <option value="Inhalation">Inhalation</option>

                    <option value="Ophthalmic">Ophthalmic</option>

                    <option value="Otic">Otic</option>

                    <option value="Rectal">Rectal</option>

                    <option value="Sublingual">Sublingual</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC STRENGTH SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Drug Strength
                </label>

                {/* TABLET / CAPSULE */}
                {(dosageForm === "Tablet" ||
                  dosageForm === "Capsule") && (

                    <div className="grid grid-cols-3 gap-4 mt-2">

                      <div>
                        <input
                          type="number"
                          placeholder="500"
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-white border-gray-200"
                            }`}
                        />
                      </div>

                      <div>
                        <select
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-white border-gray-200"
                            }`}
                        >
                          <option>mg</option>
                          <option>mcg</option>
                          <option>g</option>
                        </select>
                      </div>

                      <div
                        className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                          }`}
                      >
                        Per 1 Unit
                      </div>

                    </div>
                  )}

                {/* SYRUP / SUSPENSION */}
                {(dosageForm === "Syrup" ||
                  dosageForm === "Suspension") && (

                    <div className="grid grid-cols-4 gap-4 mt-2">

                      {/* Numerator */}
                      <input
                        type="number"
                        placeholder="125"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      />

                      {/* Unit */}
                      <select
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      >
                        <option>mg</option>
                        <option>mcg</option>
                        <option>g</option>
                      </select>

                      {/* Denominator */}
                      <input
                        type="number"
                        placeholder="5"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      />

                      {/* Volume Unit */}
                      <select
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      >
                        <option>ml</option>
                        <option>L</option>
                      </select>

                    </div>
                  )}

                {/* INJECTION */}
                {dosageForm === "Injection" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    <input
                      type="number"
                      placeholder="80"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>mg</option>
                      <option>IU</option>
                    </select>

                    <input
                      type="number"
                      placeholder="1"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>ml</option>
                      <option>vial</option>
                    </select>

                  </div>
                )}

                {/* CREAM / OINTMENT */}
                {(dosageForm === "Cream" ||
                  dosageForm === "Ointment") && (

                    <div className="grid grid-cols-2 gap-4 mt-2">

                      <input
                        type="number"
                        placeholder="1"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      />

                      <div
                        className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                          }`}
                      >
                        %
                      </div>

                    </div>
                  )}

                {/* INHALER */}
                {dosageForm === "Inhaler" && (

                  <div className="grid grid-cols-3 gap-4 mt-2">

                    <input
                      type="number"
                      placeholder="100"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>mcg</option>
                      <option>mg</option>
                    </select>

                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Per Puff
                    </div>

                  </div>
                )}

                {/* EYE / EAR DROPS */}
                {(dosageForm === "Eye Drops" ||
                  dosageForm === "Ear Drops") && (

                    <div className="grid grid-cols-4 gap-4 mt-2">

                      <input
                        type="number"
                        placeholder="0.5"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      />

                      <div
                        className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                          }`}
                      >
                        %
                      </div>

                      <input
                        type="number"
                        placeholder="10"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      />

                      <div
                        className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                          }`}
                      >
                        ml Bottle
                      </div>

                    </div>
                  )}

                <p className="text-[11px] text-gray-500 mt-3">
                  Strength format changes automatically based on dosage form.
                </p>

              </div>
            </div>
          )}

          {/* MEDICAL CONSUMABLES SECTION */}
          {itemCategory === "MEDICAL CONSUMABLES" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-blue-50 border-blue-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Consumable Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Lot Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Lot Number
                  </label>

                  <input
                    type="text"
                    placeholder="LOT-2026"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Consumable Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Consumable Type
                  </label>

                  <select
                    value={consumableType}
                    onChange={(e) => setConsumableType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Type</option>

                    <option value="Gloves">Gloves</option>

                    <option value="Syringe">Syringe</option>

                    <option value="Cannula">Cannula</option>

                    <option value="Catheter">Catheter</option>

                    <option value="Sutures">Sutures</option>

                    <option value="Face Mask">Face Mask</option>

                    <option value="Gauze">Gauze</option>

                    <option value="IV Giving Set">
                      IV Giving Set
                    </option>

                    <option value="Urine Bag">Urine Bag</option>
                  </select>
                </div>

                {/* Sterility */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Sterility
                  </label>

                  <select
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <option>Sterile</option>
                    <option>Non-Sterile</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC SIZE SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Consumable Specifications
                </label>

                {/* GLOVES */}
                {consumableType === "Gloves" && (

                  <div className="grid grid-cols-3 gap-4 mt-2">

                    {/* Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Small (S)</option>
                      <option>Medium (M)</option>
                      <option>Large (L)</option>
                      <option>XL</option>
                    </select>

                    {/* Material */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Latex</option>
                      <option>Nitrile</option>
                      <option>Vinyl</option>
                    </select>

                    {/* Pack Size */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Box of 100
                    </div>

                  </div>
                )}

                {/* SYRINGE */}
                {consumableType === "Syringe" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Volume */}
                    <input
                      type="number"
                      placeholder="5"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      ml
                    </div>

                    {/* Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Luer Lock</option>
                      <option>Insulin</option>
                      <option>Standard</option>
                    </select>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Single Use
                    </div>

                  </div>
                )}

                {/* CANNULA */}
                {consumableType === "Cannula" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Gauge */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>14G</option>
                      <option>16G</option>
                      <option>18G</option>
                      <option>20G</option>
                      <option>22G</option>
                      <option>24G</option>
                    </select>

                    {/* Color */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Orange</option>
                      <option>Grey</option>
                      <option>Green</option>
                      <option>Pink</option>
                      <option>Blue</option>
                      <option>Yellow</option>
                    </select>

                    {/* Sterility */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Sterile
                    </div>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Single Use
                    </div>

                  </div>
                )}

                {/* CATHETER */}
                {consumableType === "Catheter" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* FR Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>FR10</option>
                      <option>FR12</option>
                      <option>FR14</option>
                      <option>FR16</option>
                      <option>FR18</option>
                    </select>

                    {/* Material */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Silicone</option>
                      <option>Latex</option>
                    </select>

                    {/* Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>2-Way</option>
                      <option>3-Way</option>
                    </select>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Sterile
                    </div>

                  </div>
                )}

                {/* SUTURES */}
                {consumableType === "Sutures" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Suture Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>1/0</option>
                      <option>2/0</option>
                      <option>3/0</option>
                      <option>4/0</option>
                      <option>5/0</option>
                    </select>

                    {/* Material */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Vicryl</option>
                      <option>Nylon</option>
                      <option>Silk</option>
                    </select>

                    {/* Needle */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Round Body</option>
                      <option>Cutting</option>
                    </select>

                    {/* Sterility */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Sterile
                    </div>

                  </div>
                )}

                <p className="text-[11px] text-gray-500 mt-3">
                  Consumable specifications change automatically based on selected type.
                </p>

              </div>
            </div>
          )}

          {/* EQUIPMENT SECTION */}
          {itemCategory === "EQUIPMENT" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-purple-50 border-purple-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Equipment Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    placeholder="SN-20393"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Warranty Expiry
                  </label>

                  <input
                    type="date"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">

            <button
              onClick={() => setAddItemModal(false)}
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
            >
              Cancel
            </button>

            <button
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
            >
              Save Item
            </button>

          </div>

        </div>
      </Modal>
    </div>
  );
};

export default Inventory;

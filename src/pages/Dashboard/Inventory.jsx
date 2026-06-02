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
  const [consumableType, setConsumableType] = useState("")
  const [labType, setLabType] = useState("")
  const [equipmentType, setEquipmentType] = useState("")
  const [theatreType, setTheatreType] = useState("")
  const [radiologyType, setRadiologyType] = useState("")
  const [gasType, setGasType] = useState("")
  const [bloodBankType, setBloodBankType] = useState("")

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
              { value: "Medical_Consumables", label: "Medical Consumables" },
              { value: "Laboratory", label: "Laboratory" },
              { value: "Equipment", label: "Equipment" },
              { value: "Radiology", label: "Radiology" },
              { value: "Medical_Gases", label: "Medical Gases" },
              { value: "Blood_Bank", label: "Blood Bank" },
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
                  <option value="MEDICAL_GASES">Medical Gases</option>
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
          {itemCategory === "MEDICAL_CONSUMABLES" && (
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

          {/* LABORATORY SECTION */}
          {itemCategory === "LABORATORY" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-purple-50 border-purple-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Laboratory Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Lot Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Lot Number
                  </label>

                  <input
                    type="text"
                    placeholder="LAB-LOT-2026"
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

                {/* Lab Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Laboratory Type
                  </label>

                  <select
                    value={labType}
                    onChange={(e) => setLabType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Type</option>

                    <option value="Reagent">Reagent</option>

                    <option value="Rapid Test Kit">
                      Rapid Test Kit
                    </option>

                    <option value="Blood Tube">
                      Blood Tube
                    </option>

                    <option value="Microscope Slide">
                      Microscope Slide
                    </option>

                    <option value="Culture Media">
                      Culture Media
                    </option>

                    <option value="Sample Container">
                      Sample Container
                    </option>

                    <option value="Pipette Tip">
                      Pipette Tip
                    </option>
                  </select>
                </div>

                {/* Storage */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Storage Condition
                  </label>

                  <select
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option>Room Temperature</option>
                    <option>Refrigerated (2-8°C)</option>
                    <option>Frozen</option>
                    <option>Protect From Light</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC LAB SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Laboratory Specifications
                </label>

                {/* REAGENTS */}
                {labType === "Reagent" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Volume */}
                    <input
                      type="number"
                      placeholder="500"
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
                      <option>ml</option>
                      <option>L</option>
                    </select>

                    {/* Test Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Hematology</option>
                      <option>Chemistry</option>
                      <option>Serology</option>
                      <option>Microbiology</option>
                    </select>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Multi Use
                    </div>

                  </div>
                )}

                {/* RAPID TEST KIT */}
                {labType === "Rapid Test Kit" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Number of Tests */}
                    <input
                      type="number"
                      placeholder="25"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Pack */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Tests/Kit
                    </div>

                    {/* Kit Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Malaria</option>
                      <option>HIV</option>
                      <option>Hepatitis</option>
                      <option>COVID-19</option>
                    </select>

                    {/* Storage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Sensitive
                    </div>

                  </div>
                )}

                {/* BLOOD TUBES */}
                {labType === "Blood Tube" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Tube Color */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Purple (EDTA)</option>
                      <option>Red (Plain)</option>
                      <option>Blue (Citrate)</option>
                      <option>Yellow (Gel)</option>
                    </select>

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

                {/* CULTURE MEDIA */}
                {labType === "Culture Media" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Media Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Blood Agar</option>
                      <option>MacConkey</option>
                      <option>Chocolate Agar</option>
                    </select>

                    {/* Weight */}
                    <input
                      type="number"
                      placeholder="500"
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
                      g
                    </div>

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
                  Laboratory specifications change automatically based on selected laboratory type.
                </p>

              </div>
            </div>
          )}

          {/* EQUIPMENT SECTION */}
          {itemCategory === "EQUIPMENT" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-cyan-50 border-cyan-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Equipment / Biomedical Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Equipment Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Equipment Type
                  </label>

                  <select
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Equipment</option>

                    <option value="Patient Monitor">
                      Patient Monitor
                    </option>

                    <option value="ECG Machine">
                      ECG Machine
                    </option>

                    <option value="Infusion Pump">
                      Infusion Pump
                    </option>

                    <option value="Ventilator">
                      Ventilator
                    </option>

                    <option value="Defibrillator">
                      Defibrillator
                    </option>

                    <option value="Ultrasound Machine">
                      Ultrasound Machine
                    </option>

                    <option value="Autoclave">
                      Autoclave
                    </option>

                    <option value="Microscope">
                      Microscope
                    </option>

                    <option value="Oxygen Concentrator">
                      Oxygen Concentrator
                    </option>
                  </select>
                </div>

                {/* Serial Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    placeholder="SN-20394"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Manufacturer
                  </label>

                  <input
                    type="text"
                    placeholder="Philips"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Model Number
                  </label>

                  <input
                    type="text"
                    placeholder="MX450"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Purchase Date
                  </label>

                  <input
                    type="date"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Warranty Expiry */}
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

              {/* ========================================= */}
              {/* DYNAMIC EQUIPMENT SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Equipment Specifications
                </label>

                {/* PATIENT MONITOR */}
                {equipmentType === "Patient Monitor" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Parameters */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>5 Parameters</option>
                      <option>7 Parameters</option>
                      <option>Multiparameter</option>
                    </select>

                    {/* Screen Size */}
                    <input
                      type="number"
                      placeholder="15"
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
                      Inches
                    </div>

                    {/* Power */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Electric
                    </div>

                  </div>
                )}

                {/* INFUSION PUMP */}
                {equipmentType === "Infusion Pump" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Pump Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Syringe Pump</option>
                      <option>Volumetric Pump</option>
                    </select>

                    {/* Flow Rate */}
                    <input
                      type="number"
                      placeholder="1200"
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
                      ml/hr
                    </div>

                    {/* Battery */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Rechargeable
                    </div>

                  </div>
                )}

                {/* DEFIBRILLATOR */}
                {equipmentType === "Defibrillator" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Manual</option>
                      <option>AED</option>
                    </select>

                    {/* Energy */}
                    <input
                      type="number"
                      placeholder="360"
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
                      Joules
                    </div>

                    {/* Mobility */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Portable
                    </div>

                  </div>
                )}

                {/* OXYGEN CONCENTRATOR */}
                {equipmentType === "Oxygen Concentrator" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Capacity */}
                    <input
                      type="number"
                      placeholder="10"
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
                      Liters/Min
                    </div>

                    {/* Purity */}
                    <input
                      type="number"
                      placeholder="95"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Purity Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      % Purity
                    </div>

                  </div>
                )}

                {/* AUTOCLAVE */}
                {equipmentType === "Autoclave" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Capacity */}
                    <input
                      type="number"
                      placeholder="75"
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
                      Liters
                    </div>

                    {/* Sterilization */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Steam</option>
                      <option>Dry Heat</option>
                    </select>

                    {/* Installation */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Fixed
                    </div>

                  </div>
                )}

                <p className="text-[11px] text-gray-500 mt-3">
                  Equipment specifications change automatically based on selected biomedical device type.
                </p>

              </div>
            </div>
          )}

          {/* THEATRE SUPPLIES SECTION */}
          {itemCategory === "THEATRE" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-rose-50 border-rose-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Theatre Supply Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Lot Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Lot Number
                  </label>

                  <input
                    type="text"
                    placeholder="TH-LOT-2026"
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

                {/* Theatre Supply Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Theatre Supply Type
                  </label>

                  <select
                    value={theatreType}
                    onChange={(e) => setTheatreType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Type</option>

                    <option value="Surgical Gloves">
                      Surgical Gloves
                    </option>

                    <option value="Surgical Blade">
                      Surgical Blade
                    </option>

                    <option value="Sutures">
                      Sutures
                    </option>

                    <option value="Surgical Drapes">
                      Surgical Drapes
                    </option>

                    <option value="Gown">
                      Surgical Gown
                    </option>

                    <option value="Face Mask">
                      Face Mask
                    </option>

                    <option value="Forceps">
                      Forceps
                    </option>

                    <option value="Scalpel Handle">
                      Scalpel Handle
                    </option>

                    <option value="Sterile Pack">
                      Sterile Pack
                    </option>
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
              {/* DYNAMIC THEATRE SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Theatre Specifications
                </label>

                {/* SURGICAL GLOVES */}
                {theatreType === "Surgical Gloves" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>6.0</option>
                      <option>6.5</option>
                      <option>7.0</option>
                      <option>7.5</option>
                      <option>8.0</option>
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
                    </select>

                    {/* Powder */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Powdered</option>
                      <option>Powder-Free</option>
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

                {/* SURGICAL BLADE */}
                {theatreType === "Surgical Blade" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Blade Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>No.10</option>
                      <option>No.11</option>
                      <option>No.15</option>
                      <option>No.20</option>
                      <option>No.23</option>
                    </select>

                    {/* Material */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Stainless Steel
                    </div>

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
                      Disposable
                    </div>

                  </div>
                )}

                {/* SUTURES */}
                {theatreType === "Sutures" && (

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
                      <option>Silk</option>
                      <option>Nylon</option>
                      <option>Chromic</option>
                    </select>

                    {/* Needle Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Round Body</option>
                      <option>Cutting</option>
                      <option>Reverse Cutting</option>
                    </select>

                    {/* Absorbable */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Absorbable</option>
                      <option>Non-Absorbable</option>
                    </select>

                  </div>
                )}

                {/* SURGICAL DRAPES */}
                {theatreType === "Surgical Drapes" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Drape Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Fenestrated</option>
                      <option>Plain</option>
                    </select>

                    {/* Material */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Disposable</option>
                      <option>Reusable</option>
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
                      Theatre Use
                    </div>

                  </div>
                )}

                {/* FORCEPS */}
                {theatreType === "Forceps" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Forceps Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Artery Forceps</option>
                      <option>Tissue Forceps</option>
                      <option>Dressing Forceps</option>
                    </select>

                    {/* Material */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Stainless Steel
                    </div>

                    {/* Reusable */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Reusable
                    </div>

                    {/* Sterilization */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Autoclave
                    </div>

                  </div>
                )}

                <p className="text-[11px] text-gray-500 mt-3">
                  Theatre specifications change automatically based on selected theatre supply type.
                </p>

              </div>
            </div>
          )}

          {/* RADIOLOGY CONSUMABLES SECTION */}
          {itemCategory === "RADIOLOGY" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-indigo-50 border-indigo-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Radiology Consumable Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Lot Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Lot Number
                  </label>

                  <input
                    type="text"
                    placeholder="RAD-LOT-2026"
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

                {/* Radiology Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Radiology Consumable Type
                  </label>

                  <select
                    value={radiologyType}
                    onChange={(e) => setRadiologyType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Type</option>

                    <option value="X-Ray Film">
                      X-Ray Film
                    </option>

                    <option value="Ultrasound Gel">
                      Ultrasound Gel
                    </option>

                    <option value="Contrast Media">
                      Contrast Media
                    </option>

                    <option value="ECG Paper">
                      ECG Paper
                    </option>

                    <option value="Thermal Paper">
                      Thermal Paper
                    </option>

                    <option value="Imaging Marker">
                      Imaging Marker
                    </option>

                    <option value="CT Injector Syringe">
                      CT Injector Syringe
                    </option>

                    <option value="MRI Coil Cover">
                      MRI Coil Cover
                    </option>
                  </select>
                </div>

                {/* Storage */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Storage Condition
                  </label>

                  <select
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option>Room Temperature</option>
                    <option>Cool & Dry Place</option>
                    <option>Protect From Light</option>
                    <option>Refrigerated</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC RADIOLOGY SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Radiology Specifications
                </label>

                {/* X-RAY FILM */}
                {radiologyType === "X-Ray Film" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Film Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>8 x 10</option>
                      <option>10 x 12</option>
                      <option>12 x 15</option>
                      <option>14 x 17</option>
                    </select>

                    {/* Film Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Blue Film</option>
                      <option>Green Film</option>
                      <option>Digital Film</option>
                    </select>

                    {/* Pack Size */}
                    <input
                      type="number"
                      placeholder="100"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Pack Label */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Sheets/Box
                    </div>

                  </div>
                )}

                {/* ULTRASOUND GEL */}
                {radiologyType === "Ultrasound Gel" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Volume */}
                    <input
                      type="number"
                      placeholder="250"
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

                    {/* Color */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Clear</option>
                      <option>Blue</option>
                    </select>

                    {/* Sterility */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Non-Sterile
                    </div>

                  </div>
                )}

                {/* CONTRAST MEDIA */}
                {radiologyType === "Contrast Media" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Contrast Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Iodinated</option>
                      <option>Barium Sulphate</option>
                      <option>Gadolinium</option>
                    </select>

                    {/* Concentration */}
                    <input
                      type="number"
                      placeholder="300"
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
                      mgI/ml
                    </div>

                    {/* Bottle Size */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      100ml Vial
                    </div>

                  </div>
                )}

                {/* ECG PAPER */}
                {radiologyType === "ECG Paper" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Paper Width */}
                    <input
                      type="number"
                      placeholder="80"
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
                      mm
                    </div>

                    {/* Roll Length */}
                    <input
                      type="number"
                      placeholder="20"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Roll Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Meters
                    </div>

                  </div>
                )}

                {/* CT INJECTOR SYRINGE */}
                {radiologyType === "CT Injector Syringe" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Volume */}
                    <input
                      type="number"
                      placeholder="200"
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

                    {/* Compatibility */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Medrad</option>
                      <option>Ulrich</option>
                      <option>Nemoto</option>
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

                <p className="text-[11px] text-gray-500 mt-3">
                  Radiology specifications change automatically based on selected radiology consumable type.
                </p>

              </div>
            </div>
          )}

          {/* OXYGEN / MEDICAL GASES SECTION */}
          {itemCategory === "MEDICAL_GASES" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-sky-50 border-sky-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Oxygen / Medical Gas Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Cylinder/Batch Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Cylinder / Batch Number
                  </label>

                  <input
                    type="text"
                    placeholder="OXY-2026-001"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Gas Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Medical Gas Type
                  </label>

                  <select
                    value={gasType}
                    onChange={(e) => setGasType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Gas Type</option>

                    <option value="Oxygen">
                      Oxygen
                    </option>

                    <option value="Nitrous Oxide">
                      Nitrous Oxide
                    </option>

                    <option value="Medical Air">
                      Medical Air
                    </option>

                    <option value="Carbon Dioxide">
                      Carbon Dioxide
                    </option>

                    <option value="Nitrogen">
                      Nitrogen
                    </option>

                    <option value="Helium">
                      Helium
                    </option>
                  </select>
                </div>

                {/* Supplier */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Supplier
                  </label>

                  <input
                    type="text"
                    placeholder="BOC Gases"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Storage */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Storage Condition
                  </label>

                  <select
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option>Cool & Dry Place</option>
                    <option>Well Ventilated Area</option>
                    <option>Away From Heat Source</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC MEDICAL GAS SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Gas Specifications
                </label>

                {/* OXYGEN */}
                {gasType === "Oxygen" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Cylinder Size */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>J Cylinder</option>
                      <option>E Cylinder</option>
                      <option>D Cylinder</option>
                    </select>

                    {/* Capacity */}
                    <input
                      type="number"
                      placeholder="6800"
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
                      Liters
                    </div>

                    {/* Purity */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      99% Purity
                    </div>

                  </div>
                )}

                {/* NITROUS OXIDE */}
                {gasType === "Nitrous Oxide" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Cylinder Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Large Cylinder</option>
                      <option>Portable Cylinder</option>
                    </select>

                    {/* Pressure */}
                    <input
                      type="number"
                      placeholder="750"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Pressure Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      PSI
                    </div>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Anaesthesia
                    </div>

                  </div>
                )}

                {/* MEDICAL AIR */}
                {gasType === "Medical Air" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Delivery Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Cylinder</option>
                      <option>Pipeline</option>
                    </select>

                    {/* Flow Rate */}
                    <input
                      type="number"
                      placeholder="15"
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
                      L/min
                    </div>

                    {/* Purity */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Medical Grade
                    </div>

                  </div>
                )}

                {/* CARBON DIOXIDE */}
                {gasType === "Carbon Dioxide" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Cylinder Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Industrial</option>
                      <option>Medical Grade</option>
                    </select>

                    {/* Capacity */}
                    <input
                      type="number"
                      placeholder="5000"
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
                      Liters
                    </div>

                    {/* Usage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                        ? "bg-gray-900 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Laparoscopy
                    </div>

                  </div>
                )}

                <p className="text-[11px] text-gray-500 mt-3">
                  Medical gas specifications change automatically based on selected gas type.
                </p>

              </div>
            </div>
          )}

          {/* BLOOD BANK SECTION */}
          {itemCategory === "BLOOD_BANK" && (
            <div
              className={`rounded-2xl border p-5 ${darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-red-50 border-red-100"
                }`}
            >
              <h3 className="font-bold text-sm mb-5 uppercase tracking-wider text-gray-500">
                Blood Bank Information
              </h3>

              <div className="grid grid-cols-2 gap-5">

                {/* Lot Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Lot Number
                  </label>

                  <input
                    type="text"
                    placeholder="BB-LOT-2026"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  />
                </div>

                {/* Expiry Date */}
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

                {/* Blood Bank Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Blood Bank Type
                  </label>

                  <select
                    value={bloodBankType}
                    onChange={(e) => setBloodBankType(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="">Select Type</option>

                    <option value="Blood Bag">
                      Blood Bag
                    </option>

                    <option value="Blood Grouping Reagent">
                      Blood Grouping Reagent
                    </option>

                    <option value="Crossmatch Reagent">
                      Crossmatch Reagent
                    </option>

                    <option value="Donor Kit">
                      Donor Kit
                    </option>

                    <option value="Transfusion Set">
                      Transfusion Set
                    </option>

                    <option value="Blood Filter">
                      Blood Filter
                    </option>

                    <option value="Sample Tube">
                      Sample Tube
                    </option>

                    <option value="Anticoagulant">
                      Anticoagulant
                    </option>
                  </select>
                </div>

                {/* Storage Condition */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Storage Condition
                  </label>

                  <select
                    className={`w-full mt-2 px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <option>2 - 6°C</option>
                    <option>Frozen</option>
                    <option>Room Temperature</option>
                    <option>Protected From Sunlight</option>
                  </select>
                </div>

              </div>

              {/* ========================================= */}
              {/* DYNAMIC BLOOD BANK SECTION */}
              {/* ========================================= */}

              <div className="mt-6">

                <label className="text-xs font-bold uppercase text-gray-500">
                  Blood Bank Specifications
                </label>

                {/* BLOOD BAG */}
                {bloodBankType === "Blood Bag" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Capacity */}
                    <input
                      type="number"
                      placeholder="450"
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

                    {/* Bag Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Single Bag</option>
                      <option>Double Bag</option>
                      <option>Triple Bag</option>
                      <option>Quadruple Bag</option>
                    </select>

                    {/* Anticoagulant */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      CPDA-1
                    </div>

                  </div>
                )}

                {/* BLOOD GROUPING REAGENT */}
                {bloodBankType === "Blood Grouping Reagent" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Reagent Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Anti-A</option>
                      <option>Anti-B</option>
                      <option>Anti-D</option>
                      <option>AHG</option>
                    </select>

                    {/* Volume */}
                    <input
                      type="number"
                      placeholder="10"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Volume Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      ml
                    </div>

                    {/* Storage */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Refrigerated
                    </div>

                  </div>
                )}

                {/* CROSSMATCH REAGENT */}
                {bloodBankType === "Crossmatch Reagent" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Reagent Name */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>AHG</option>
                      <option>LISS</option>
                      <option>Coombs Serum</option>
                    </select>

                    {/* Quantity */}
                    <input
                      type="number"
                      placeholder="100"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Quantity Unit */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Tests
                    </div>

                    {/* Temperature */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      2 - 8°C
                    </div>

                  </div>
                )}

                {/* DONOR KIT */}
                {bloodBankType === "Donor Kit" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Kit Type */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>Standard Kit</option>
                      <option>Apheresis Kit</option>
                    </select>

                    {/* Components */}
                    <input
                      type="number"
                      placeholder="5"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    />

                    {/* Components Label */}
                    <div
                      className={`flex items-center px-4 rounded-xl text-sm font-semibold ${darkMode
                          ? "bg-gray-900 border border-gray-700"
                          : "bg-gray-100 border border-gray-200"
                        }`}
                    >
                      Components
                    </div>

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

                {/* TRANSFUSION SET */}
                {bloodBankType === "Transfusion Set" && (

                  <div className="grid grid-cols-4 gap-4 mt-2">

                    {/* Filter */}
                    <select
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option>170 Micron Filter</option>
                      <option>200 Micron Filter</option>
                    </select>

                    {/* Tube Length */}
                    <input
                      type="number"
                      placeholder="150"
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
                      cm
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

                <p className="text-[11px] text-gray-500 mt-3">
                  Blood bank specifications change automatically based on selected blood bank item type.
                </p>

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
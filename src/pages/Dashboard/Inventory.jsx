import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  HiOutlinePlus,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tag, Tooltip, Select } from "antd";
import StatCard from "../../components/StatCard";
import CustomTable from "../../components/CustomTable"; // Adjust path as needed
import { useStore } from "../../store/store";

const INITIAL_INVENTORY = [
  { id: "INV-001", name: "Paracetamol 500mg", category: "Drugs", stock: 450, unit: "Pack", price: 12.0 },
  { id: "INV-002", name: "Surgical Gloves (M)", category: "Medical Supplies", stock: 12, unit: "Box", price: 25.0 },
  { id: "INV-003", name: "Digital Thermometer", category: "Equipment", stock: 0, unit: "Unit", price: 45.0 },
  { id: "INV-004", name: "Amoxicillin Syrup", category: "Drugs", stock: 85, unit: "Bottle", price: 18.5 },
  { id: "INV-005", name: "Face Masks (N95)", category: "Medical Supplies", stock: 500, unit: "Box", price: 60.0 },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [filterCategory, setFilterCategory] = useState("All");
  const { darkMode } = useStore();

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
      : inventory.filter(item => item.category === filterCategory);
  }, [inventory, filterCategory]);

  return (
    <div className="px-4 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            <HiOutlineClipboardList className="text-blue-600" />
            Store Inventory
          </h2>
          <p className="text-gray-500 text-sm">
            Manage medical supplies, drugs, and hospital equipment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button {...buttonMotion} className={buttonStyle}>
            <HiOutlinePlus /> Add New Item
          </motion.button>
        </div>
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
        actions={(row) => (
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
        )}
      />
    </div>
  );
};

export default Inventory;
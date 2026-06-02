import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store/store";

const PrescriptionSection = () => {
  const { darkMode } = useStore();

  // Local state for tracking selected medications and custom dropdown controls
  const [drugAddons, setDrugAddons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close custom dropdown when clicking outside of the active area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter DRUG_OPTIONS dynamically based on user search string
  const filteredOptions = DRUG_OPTIONS.filter((drug) =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {/* Drug Search & Multi-Select Column */}
        <div className="col-span-2 relative" ref={dropdownRef}>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Drug Names
          </label>

         

          {/* Search Input Field */}
          <div className="relative">
            <input
              type="text"
              placeholder={drugAddons.length > 0 ? "Add more medications..." : "Search medication..."}
              value={searchQuery}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none w-full text-sm ${
                darkMode
                  ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />
          </div>
           {/* Selected Tags Container */}
          {drugAddons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
              {drugAddons.map((drug) => (
                <span
                  key={drug.name}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                    darkMode
                      ? "bg-blue-950 text-blue-300 border border-blue-800"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {drug.name}
                  <button
                    type="button"
                    className="hover:text-red-500 font-bold focus:outline-none ml-1 text-sm leading-none"
                    onClick={() => {
                      setDrugAddons(drugAddons.filter((d) => d.name !== drug.name));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown Options List */}
          {isOpen && (
            <div
              className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-xs text-gray-400 text-center">No medications found</div>
              ) : (
                filteredOptions.map((drug) => {
                  const isSelected = drugAddons.some((d) => d.name === drug.name);

                  return (
                    <button
                      key={drug.name}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setDrugAddons(drugAddons.filter((d) => d.name !== drug.name));
                        } else {
                          setDrugAddons([...drugAddons, { ...drug, category: "PHARMACY" }]);
                        }
                        setSearchQuery(""); // Clear lookup input on confirm
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        darkMode
                          ? "hover:bg-gray-700/50 text-gray-200 border-b border-gray-700/50 last:border-0"
                          : "hover:bg-gray-50 text-gray-700 border-b border-gray-100 last:border-0"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                        />
                        <span className={isSelected ? "font-medium" : ""}>{drug.name}</span>
                      </div>
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        ₦{drug.amount.toLocaleString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Strength Input */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Strength
          </label>
          <input
            type="text"
            placeholder="500mg"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Route Select */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Route
          </label>
          <select
            className={`px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none w-full text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option>Oral</option>
            <option>IV</option>
            <option>IM</option>
            <option>Topical</option>
            <option>Inhalation</option>
          </select>
        </div>
      </div>

      {/* Dosing Rows */}
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Dose
          </label>
          <input
            type="text"
            placeholder="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
            }`}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Unit
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option>Tablet</option>
            <option>Capsule</option>
            <option>ml</option>
            <option>Puff</option>
            <option>Tube</option>
            <option>Bag</option>
            <option>Ampoule</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Frequency
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option>OD</option>
            <option>BD</option>
            <option>TDS</option>
            <option>QID</option>
            <option>PRN</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Duration
          </label>
          <input
            type="text"
            placeholder="5"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
            }`}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Days
          </label>
          <div
            className={`px-3 py-2 border rounded-lg transition-all text-sm select-none ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-500"
            }`}
          >
            Days
          </div>
        </div>
      </div>

      {/* Special Instructions Field */}
      <div>
        <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
          Instruction
        </label>
        <textarea
          rows={3}
          placeholder="Take after meals..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none text-sm ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
          }`}
        />
      </div>
    </div>
  );
};

export default PrescriptionSection;
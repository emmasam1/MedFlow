// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import DataTable from "../../components/Table";
// import Modal from "../../components/Modal";
// import { FiEye } from "react-icons/fi";
// import { useStore } from "../../store/store";
// import { useAppStore } from "../../store/useAppStore";

// const LabRequests = () => {
//   const { darkMode } = useStore();
//   const { queue, getQueue, updateQueue, submitLabResult } = useAppStore();

//   const [selected, setSelected] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     getQueue();
//   }, []);

//   // 🔥 FILTER ONLY VALID LAB REQUESTS
//   const labRequests = queue.filter(
//     (q) =>
//       q.service === "lab" &&
//       q.paymentStatus === "paid" &&
//       q.currentDepartment === "lab"
//   );

//   // 🧠 TABLE COLUMNS
//   const columns = [
//     { title: "Patient", key: "patientName" },
//     { title: "Priority", key: "priority" },
//     { title: "Amount", key: "labAmount" },
//     {
//       title: "Tests",
//       key: "labTests",
//       render: (tests) => tests?.length || 0,
//     },
//     {
//       title: "Status",
//       key: "status",
//       render: (v) => (
//         <span
//           className={`px-3 py-1 text-xs rounded-full ${
//             v === "waiting"
//               ? "bg-yellow-100 text-yellow-600"
//               : v === "processing"
//               ? "bg-blue-100 text-blue-600"
//               : "bg-green-100 text-green-600"
//           }`}
//         >
//           {v}
//         </span>
//       ),
//     },
//   ];

//   // 🔥 ACTIONS (LIKE PATIENT PAGE)
//   const actions = (row) => (
//     <div className="flex mt-2" onClick={(e) => e.stopPropagation()}>
//       {/* VIEW */}
//       <div
//         className={`p-2 rounded-full cursor-pointer ${
//           darkMode
//             ? "hover:bg-gray-700 text-gray-200"
//             : "hover:bg-gray-200 text-gray-700"
//         }`}
//         onClick={() => {
//           setSelected(row);
//           setIsOpen(true);
//         }}
//       >
//         <FiEye />
//       </div>

//       {/* START TEST */}
//       {row.status === "waiting" && (
//         <button
//           onClick={() =>
//             updateQueue(row.id, { status: "processing" })
//           }
//           className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
//         >
//           Start
//         </button>
//       )}

//       {/* COMPLETE */}
//       {row.status === "processing" && (
//         <button
//           onClick={() =>
//             updateQueue(row.id, {
//               status: "done",
//               currentDepartment: "doctor",
//             })
//           }
//           className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded"
//         >
//           Complete
//         </button>
//       )}
//     </div>
//   );

//   return (
//     <div
//       className={`${
//         darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
//       } p-4 min-h-screen`}
//     >
//       {/* TABLE */}
//       <div className="overflow-hidden">
//         <DataTable
//           columns={columns}
//           data={labRequests}
//           searchableKeys={["patientName"]}
//           actions={actions}
//         />
//       </div>

//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {isOpen && selected && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className={`${
//                 darkMode
//                   ? "bg-gray-800 text-gray-100"
//                   : "bg-white text-gray-900"
//               } w-[500px] rounded-xl p-6`}
//               initial={{ y: 40 }}
//               animate={{ y: 0 }}
//               exit={{ y: 40 }}
//             >
//               <h2 className="text-lg font-bold mb-4">
//                 {selected.patientName}
//               </h2>

//               <p className="mb-2 text-sm text-gray-400">
//                 Doctor Notes:
//               </p>
//               <p className="mb-4">{selected.doctorNotes || "—"}</p>

//               <h3 className="font-semibold mb-2">Lab Tests</h3>

//               <ul className="space-y-2">
//                 {selected.labTests?.map((test) => (
//                   <li
//                     key={test.id}
//                     className="flex justify-between text-sm"
//                   >
//                     <span>{test.name}</span>
//                     <span>₦{test.amount}</span>
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="mt-6 px-4 py-2 bg-gray-500 text-white rounded"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default LabRequests;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
import { FiEye } from "react-icons/fi";
import { useStore } from "../../store/store";
import { useAppStore } from "../../store/useAppStore";
import dayjs from "dayjs";

const LabRequests = () => {
  const { darkMode } = useStore();
  const { queue, getQueue, updateQueue, submitLabResult } = useAppStore();
  const [localLoading, setLocalLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const user = useAppStore((state) => state.user);

  const [resultData, setResultData] = useState({
    tests: [],
    notes: "",
    file: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      // We pass user?.role or fallback to what is in sessionStorage inside the store
      await getQueue(user?.role, selectedDate);
      setLocalLoading(false);
    };

    fetchData();
  }, [getQueue, selectedDate, user?.role]);

  console.log(queue);

  /* ---------------- FILTER ---------------- */

  const labRequests = queue.filter(
    (q) =>
      q.service === "lab" &&
      q.paymentStatus === "paid" &&
      q.currentDepartment === "lab" &&
      q.status !== "done",
  );

  /* ---------------- TABLE ---------------- */

  const columns = [
    { title: "Patient", key: "patientName" },
    { title: "Priority", key: "priority" },
    { title: "Amount", key: "labAmount" },
    {
      title: "Tests",
      key: "labTests",
      render: (tests) => tests?.length || 0,
    },
    {
      title: "Status",
      key: "status",
      render: (v) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            v === "waiting"
              ? "bg-yellow-100 text-yellow-600"
              : v === "processing"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          {v}
        </span>
      ),
    },
  ];

  /* ---------------- ACTIONS ---------------- */

  const actions = (row) => (
    <div className="flex mt-2" onClick={(e) => e.stopPropagation()}>
      {/* VIEW */}
      <div
        className={`p-2 rounded-full cursor-pointer ${
          darkMode
            ? "hover:bg-gray-700 text-gray-200"
            : "hover:bg-gray-200 text-gray-700"
        }`}
        onClick={() => {
          setSelected(row);
          setIsOpen(true);
          setResultData({ tests: [], notes: "", file: "" });
        }}
      >
        <FiEye />
      </div>

      {/* START */}
      {row.status === "waiting" && (
        <button
          onClick={() => updateQueue(row.id, { status: "processing" })}
          className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
        >
          Start
        </button>
      )}

      {/* ENTER RESULT */}
      {row.status === "processing" && (
        <button
          onClick={() => {
            setSelected(row);
            setIsOpen(true);
          }}
          className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded"
        >
          Enter Result
        </button>
      )}
    </div>
  );

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    await submitLabResult(selected, resultData);

    setIsOpen(false);
    setSelected(null);
    setResultData({ tests: [], notes: "", file: "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } p-4 min-h-screen`}
    >
      {/* TABLE */}
      <div className="overflow-hidden">
        <DataTable
          columns={columns}
          data={labRequests}
          searchableKeys={["patientName"]}
          actions={actions}
        />
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isOpen && selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${
                darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              } w-[600px] rounded-xl p-6 max-h-[90vh] overflow-y-auto`}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
            >
              <h2 className="text-lg font-bold mb-4">{selected.patientName}</h2>

              {/* DOCTOR NOTES */}
              <p className="text-sm text-gray-400">Doctor Notes:</p>
              <p className="mb-4">{selected.doctorNotes || "—"}</p>

              {/* TEST INPUTS */}
              <h3 className="font-semibold mb-2">Enter Results</h3>

              {selected.labTests?.map((test, index) => (
                <div key={test.id} className="mb-4">
                  <p className="text-sm font-medium">{test.name}</p>

                  <input
                    placeholder="Result (e.g Positive)"
                    className="w-full border p-2 rounded mt-1"
                    onChange={(e) => {
                      const updated = [...resultData.tests];
                      updated[index] = {
                        ...updated[index],
                        name: test.name,
                        result: e.target.value,
                      };
                      setResultData({ ...resultData, tests: updated });
                    }}
                  />
                </div>
              ))}

              {/* NOTES */}
              <textarea
                placeholder="Remarks"
                className="w-full border p-2 rounded mt-3"
                onChange={(e) =>
                  setResultData({
                    ...resultData,
                    notes: e.target.value,
                  })
                }
              />

              {/* FILE */}
              <input
                type="file"
                className="mt-3"
                onChange={(e) =>
                  setResultData({
                    ...resultData,
                    file: e.target.files[0]?.name,
                  })
                }
              />

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save & Complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabRequests;

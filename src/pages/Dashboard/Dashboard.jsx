import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import dayjs from "dayjs";
import { Form, Skeleton, Card, Col } from "antd";
import {
  RiImageAddLine,
  RiDeleteBin7Line,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

// Layout & UI Components
import PatientChart from "../../components/PatientChart";
import StatCard from "../../components/StatCard";
import Appointments from "../../components/Appointments";
import BookAppointment from "../../components/BookAppointment";
import AppointmentTable from "../../components/AppointmentTable";
import NewPatientChart from "../../components/NewPatientChart";
import Modal from "../../components/Modal";
import AddPatients from "../../components/AddPatients";
import DoctorsAppointment from "../../components/DoctorsAppointment";
import CreateQueue from "../../components/CreateQueue";
import ScheduleCard from "../../components/ScheduleCard";
import PatientQueue from "../../components/PatientQueue";

// Role-Specific Panels
import NurseTasks from "../../components/NurseTasks";
import VitalsTracker from "../../components/VitalsTracker";
import ShiftSchedule from "../../components/ShiftSchedule";
import MedicationList from "../../components/MedicationList";
import NurseTodo from "../../components/NurseTodo";
import AssignedPatients from "../../components/AssignedPatients";
import PatientNotes from "../../components/PatientNotes";
import CriticalAlerts from "../../components/RealTimeIndicator";

// Icons
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineQueue } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";

// Store
import { useStore } from "../../store/store";
import { useAppStore } from "../../store/useAppStore";

const Dashboard = () => {
  const { darkMode } = useStore();
  const {
    patients,
    appointments,
    getPatients,
    fetchPatients,
    fetchAppointments,
    queue,
    registerStaff,
    getStaff,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [recordTab, setRecordTab] = useState("appointments");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const location = useLocation();
  const pathName =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  // Auth & Role
  // const encryptedUser = sessionStorage.getItem("user");
  // let user = null;

  // if (encryptedUser) {
  //   try {
  //     // Pull the key from your .env file
  //     const secretKey = import.meta.env.VITE_ENCRYPTION_KEY;

  //     const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
  //     const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

  //     // Check if decryptedText is empty (happens if the key is wrong)
  //     if (!decryptedText) {
  //       console.error("Decryption resulted in empty string. Check your VITE_ENCRYPTION_KEY.");
  //     } else {
  //       user = JSON.parse(decryptedText);
  //     }
  //   } catch (e) {
  //     console.error("Failed to decrypt user data:", e);
  //   }
  // }
  const user = useAppStore((state) => state.user);

  const role = user?.role?.toLowerCase();
  // console.log("Current User Role:", role);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.stopPropagation(); // Prevent triggering the file input
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPreview(null);
    form.resetFields();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUser = async (e) => {
    // 1. STOP THE RELOAD
    e.preventDefault();

    setIsSubmitting(true);
    console.log("Registration started...");

    // 2. Extract data from the form
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const file = fileInputRef.current?.files[0];

    const submissionData = {
      ...values,
      avatar: file,
    };

    // Log the data being sent (Note: FormData is hard to view, so we log the object)
    // console.log("Submitting Data:", submissionData);

    try {
      const response = await registerStaff(submissionData);

      // LOG SUCCESS
      // console.log("Registration Success Response:", response);
      toast.success("Staff registered successfully!");

      // 3. Update local UI state so the new user appears in the table immediately
      if (response?.data) {
        // Use the spread operator only if you're sure prev is an array
        setUsers((prev) => [
          response.data,
          ...(Array.isArray(prev) ? prev : []),
        ]);
      }

      handleClose();
    } catch (err) {
      // LOG ERROR
      console.error("Registration Error:", err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const response = await getStaff();
        // console.log(response)
        // Extract the array from the object structure: { staffMembers: [], totalStaff: 0 }
        const staffArray = response?.staffMembers || [];
        setUsers(staffArray);
      } catch (err) {
        {
          user?.role !== "admin"
            ? ""
            : toast.error("Could not load staff list");
        }
        setUsers([]); // Fallback to empty array
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [getStaff]);

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const StatSkeleton = () => (
    <Card className="w-full">
      <Skeleton active avatar={{ size: "small" }} paragraph={{ rows: 1 }} />
    </Card>
  );

  /* ---------------- Computed Stats ---------------- */
  const today = dayjs().format("YYYY-MM-DD");

  // Use optional chaining and default to empty arrays to prevent .length errors
  const safeAppointments = appointments || [];
  const safePatients = patients || [];
  const safeQueue = queue || [];

  const totalAppointments = safeAppointments.length;
  const totalPatients = safePatients.length;

  const newPatients = safePatients.filter((p) => p.regDate === today).length;

  const todaysQueue = safeQueue.filter(
    (q) => dayjs(q.createdAt).format("YYYY-MM-DD") === today,
  );

  const waitingQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "waiting",
  ).length;
  const doneQueue = todaysQueue.filter(
    (q) => q.status?.toLowerCase() === "done",
  ).length;
  const urgentQueue = todaysQueue.filter(
    (q) => q.priority?.toLowerCase() === "urgent",
  ).length;

  const totalRevenue = safeQueue
    .filter((q) => q.paymentStatus === "paid" || q.paymentStatus === "partial")
    .reduce((sum, q) => sum + (q.labAmount || 0), 0);

  const pendingPayments = safeQueue.filter(
    (q) => q.paymentStatus === "pending",
  ).length;
  const totalBalance = safeQueue.reduce((sum, q) => sum + (q.balance || 0), 0);

  /* ---------------- Animations & Styles ---------------- */
  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-4">
        <div>
          <h2
            className={`text-2xl font-black capitalize ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            {pathName.replace(/-/g, " ")}
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            Dashboard <span className="text-[10px]">🏠</span> Home
            <span className="text-[10px]">&gt;</span>
            <span className="text-blue-500 font-medium capitalize">
              {pathName}
            </span>
          </p>
        </div>

        {/* ADMIN & RECORDS ACTION BUTTONS */}
        <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
          {/* ONLY show 'Add User' if the role is admin */}
          {role === "admin" && (
            <motion.button
              {...buttonMotion}
              onClick={() => setIsAddModalOpen(true)}
              className={buttonStyle}
            >
              <AiOutlineUserAdd size={18} /> Add New Staff
            </motion.button>
          )}

          {/* ONLY show Patient/Appointment/Queue if the role is record_officer */}
          {role === "record_officer" && (
            <>
              <motion.button
                {...buttonMotion}
                onClick={() => setIsOpen(true)}
                className={buttonStyle}
              >
                <AiOutlineUserAdd size={18} /> Add Patient
              </motion.button>

              <motion.button
                {...buttonMotion}
                onClick={() => setIsAppointment(true)}
                className={buttonStyle}
              >
                <FiCalendar size={18} /> Appointment
              </motion.button>

              <motion.button
                {...buttonMotion}
                onClick={() => setIsQueueOpen(true)}
                className={buttonStyle}
              >
                <MdOutlineQueue size={18} /> Queue
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* STATS GRID (4 Columns) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* ADMIN VIEW */}
          {role === "admin" && (
            <>
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Col xs={24} sm={12} lg={24} key={`skeleton-${index}`}>
                      <StatSkeleton />
                    </Col>
                  ))
              ) : (
                <>
                  <StatCard
                    title="Total Staff"
                    value={users.length}
                    color="blue"
                  />
                  <StatCard title="On Duty" value="12" color="purple" />
                  <StatCard
                    title="Total Revenue"
                    value={`₦${totalRevenue.toLocaleString()}`}
                    color="green"
                  />
                  <StatCard title="System Alerts" value="3" color="red" />
                </>
              )}
            </>
          )}

          {/* DOCTOR VIEW */}
          {role === "doctor" && (
            <>
              <StatCard
                title="Today Queue"
                value={todaysQueue.length}
                color="purple"
              />
              <StatCard title="Waiting" value={waitingQueue} color="orange" />
              <StatCard title="Completed" value={doneQueue} color="green" />
              <StatCard title="Urgent" value={urgentQueue} color="red" />
            </>
          )}

          {/* NURSE VIEW */}
          {role === "nurse" && (
            <>
              <StatCard title="Assigned Patients" value="8" color="blue" />
              <StatCard title="Pending Tasks" value="5" color="orange" />
              <StatCard title="Completed" value="12" color="green" />
              <StatCard title="Critical Alerts" value="2" color="red" />
            </>
          )}

          {/* FINANCE VIEW */}
          {role === "finance_officer" && (
            <>
              <StatCard
                title="Revenue"
                value={`₦${totalRevenue}`}
                color="green"
              />
              <StatCard
                title="Pending"
                value={pendingPayments}
                color="orange"
              />
              <StatCard
                title="Outstanding"
                value={`₦${totalBalance}`}
                color="red"
              />
              <StatCard title="Paid Count" value={doneQueue} color="blue" />
            </>
          )}

          {/* RECORD OFFICER VIEW (Uses Toggle Logic) */}
          {role === "record_officer" && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Col xs={24} sm={12} lg={24} key={`skeleton-${index}`}>
                      <StatSkeleton />
                    </Col>
                  ))
              ) : (
                <>
                  <StatCard
                    title="Total Patients"
                    value={totalPatients}
                    color="blue"
                  />
                  <StatCard
                    title="New Today"
                    value={newPatients}
                    color="green"
                  />
                  <StatCard
                    title="Appointments"
                    value={totalAppointments}
                    color="purple"
                  />
                  <StatCard
                    title="Active Queue"
                    value={waitingQueue}
                    color="orange"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* MAIN DASHBOARD LAYOUTS */}
        <div className="px-4">
          {/* ADMIN & DOCTOR & SPECIALIST GRID */}
          {(role === "admin" || role === "doctor" || role === "specialist") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 shadow-sm rounded-3xl overflow-hidden">
                <PatientChart />
              </div>
              <div className="space-y-6">
                <ScheduleCard />
                {role === "doctor" ? <PatientQueue /> : <CriticalAlerts />}
              </div>
            </div>
          )}

          {/* NURSE SPECIFIC LAYOUT */}
          {role === "nurse" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PatientChart />
                <NurseTasks />
                <ShiftSchedule shifts={[{ time: "8AM-4PM", notes: "Day" }]} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <MedicationList />
                <NurseTodo />
                <div className="space-y-6">
                  <AssignedPatients />
                  <CriticalAlerts />
                </div>
              </div>
            </>
          )}

          {/* RECORD OFFICER LAYOUT */}
          {role === "record_officer" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PatientChart />
              <div className="space-y-6">
                <BookAppointment />
              </div>
              <Appointments />
            </div>
          )}
        </div>
          <div className="px-4">

          <NewPatientChart />
          </div>
        {/* BOTTOM SECTION: DATA TABLES */}
        <div className="px-4 pb-10">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
            <AppointmentTable />
          </div>
        </div>
      </motion.div>

      {/* ADD PATIENT */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Patient"
        size="2xl"
      >
        <AddPatients onSuccess={() => setIsOpen(false)} />
      </Modal>

      <Modal
        isOpen={isAppointment}
        onClose={() => setIsAppointment(false)}
        title="Create Appointment"
        size="3xl"
      >
        <DoctorsAppointment onSuccess={() => setIsAppointment(false)} />
      </Modal>

      <Modal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        title="Patient Queue"
        size="3xl"
      >
        <CreateQueue onSuccess={() => setIsQueueOpen(false)} />
      </Modal>

      {/* 4. Add Staff Modal */}
      <Modal
        title="Register New Staff"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <form onSubmit={handleAddUser}>
          <div className="flex flex-col items-center sm:items-end mb-6">
            <div
              className={`h-32 w-32 flex overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 relative group transition-all ${
                !preview ? "bg-green-50" : "bg-white"
              }`}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  {/* Remove Image Overlay */}
                  <div
                    onClick={removeImage}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <RiDeleteBin7Line size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full text-green-600 text-[10px] font-bold text-center p-2">
                  <RiImageAddLine size={28} className="mb-1" />
                  <span>UPLOAD PHOTO</span>
                  {/* Invisible input is only active when there is no preview */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            {/* {preview && (
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="text-red-500 text-[11px] font-bold mt-2 uppercase hover:underline"
                      >
                          Remove Image
                      </button>
                  )} */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="px-3 py-2 border rounded-lg border-gray-300"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="px-3 py-2 border rounded-lg border-gray-300"
            />
            <input
              type="text"
              name="email"
              placeholder="john.doe@example.com"
              className="px-3 py-2 border rounded-lg border-gray-300"
            />
            <div className="relative flex flex-col">
              <input
                type={showPassword ? "text" : "password"} // Switches type
                name="password"
                placeholder="Password"
                className="px-3 py-2 border rounded-lg border-gray-300 pr-10" // pr-10 makes room for icon
              />
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <RiEyeOffLine size={18} />
                ) : (
                  <RiEyeLine size={18} />
                )}
              </button>
            </div>
            <select
              name="role"
              className="px-3 py-2 border rounded-lg border-gray-300 cursor-pointer"
              // required
            >
              <option value="" disabled selected>
                Select a Role
              </option>

              {/* Administrative */}
              <optgroup label="Administration">
                <option value="admin">System Admin</option>
                <option value="record_officer">Medical Record Officer</option>
              </optgroup>

              {/* Clinical */}
              <optgroup label="Medical Staff">
                <option value="doctor">Medical Doctor</option>
                <option value="specialist">Specialist</option>
                <option value="nurse">Nurse / Matron</option>
              </optgroup>

              {/* Laboratory & Technical */}
              <optgroup label="Laboratory & Diagnostics">
                <option value="lab_officer">Laboratory Scientist</option>
                <option value="pharmacist">Pharmacist</option>
              </optgroup>

              {/* Financial */}
              <optgroup label="Finance">
                <option value="finance_officer">
                  Finance / Billing Officer
                </option>
              </optgroup>
            </select>

            <select
              name="department"
              className="px-3 py-2 border rounded-lg border-gray-300 cursor-pointer"
              // required
            >
              <option value="" disabled selected>
                Select Department
              </option>

              {/* Clinical Departments */}
              <optgroup label="Clinical Services">
                <option value="General Medicine">General Medicine (OPD)</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Obstetrics & Gynecology">
                  Obstetrics & Gynecology
                </option>
                <option value="Cardiology">Cardiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency / ER</option>
              </optgroup>

              {/* Support Services */}
              <optgroup label="Support & Diagnostics">
                <option value="Laboratory">Laboratory</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology (X-Ray/MRI)</option>
                <option value="Nursing">Nursing Unit</option>
              </optgroup>

              {/* Administration */}
              <optgroup label="Administrative">
                <option value="Front Desk">Front Desk / Records</option>
                <option value="Finance">Finance & Accounts</option>
                <option value="HR">Human Resources</option>
                <option value="IT">IT Support</option>
              </optgroup>
            </select>

            <select
              name="specialization"
              className="px-3 py-2 border rounded-lg border-gray-300 cursor-pointer"
            >
              <option value="">General Practice (No Specialization)</option>

              <optgroup label="Clinical Specialties">
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Obstetrics & Gynecology">
                  Obstetrics & Gynecology
                </option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Ophthalmology">Ophthalmology (Eye)</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Psychiatry">Psychiatry</option>
              </optgroup>

              <optgroup label="Nursing & Allied">
                <option value="Intensive Care">Intensive Care (ICU)</option>
                <option value="Midwifery">Midwifery</option>
                <option value="Anesthesia">Anesthesia</option>
                <option value="Public Health">Public Health</option>
              </optgroup>

              <optgroup label="Laboratory & Research">
                <option value="Hematology">Hematology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Pathology">Pathology</option>
              </optgroup>
            </select>

            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              className="px-3 py-2 border rounded-lg border-gray-300"
            />
            <div className="flex flex-col">
              <div className="relative flex items-center">
                {/* Country Prefix Section */}
                <div className="absolute left-3 flex items-center gap-2 pointer-events-none border-r pr-2 border-gray-200">
                  <span className="text-xs font-bold text-gray-500">+234</span>
                </div>

                <input
                  type="tel" // Opens numeric keypad on mobile
                  name="phoneNumber"
                  placeholder="801 234 5678"
                  className="w-full pl-16 pr-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 ml-1">
                Format: 8012345678
              </span>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
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
              {isSubmitting ? "Creating..." : " Create Account"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default React.memo(Dashboard);

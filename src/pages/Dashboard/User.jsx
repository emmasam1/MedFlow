import React, { useState, useRef, useEffect, use } from "react";
import { Card, Form, Select, Tooltip, Badge, Row, Col } from "antd";
import {
  RiSearchLine,
  RiEditLine,
  RiFilter3Line,
  RiKey2Line,
  RiUserFollowLine,
  RiUserForbidLine,
  RiImageAddLine,
  RiDeleteBin7Line,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import StatCard from "../../components/StatCard";
import { useStore } from "../../store/store";
import { motion } from "framer-motion";
import Modal from "../../components/Modal";
import { useAppStore } from "../../store/useAppStore";
import { ToastContainer, toast, Bounce } from "react-toastify";

const User = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const { darkMode } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { registerStaff, getStaff } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("all");

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
        toast.error("Could not load staff list");
        setUsers([]); // Fallback to empty array
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [getStaff]);

  // --- Search and Filter Logic ---
  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchText.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchText.toLowerCase());
        const matchesRole = filterRole === "all" || u.role === filterRole;
        return matchesSearch && matchesRole;
      })
    : [];

  console.log(users);

  const SkeletonRows = () => (
    <tr className="animate-pulse border-b border-gray-50">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-200 rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200 rounded" />
          <div className="h-2 w-24 bg-slate-100 rounded" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-16 bg-slate-200 rounded ml-auto" />
      </td>
    </tr>
  );

  const getRoleStyles = (role) => {
    const roleLower = role?.toLowerCase() || "";
    if (roleLower.includes("admin")) return "bg-purple-100 text-purple-700";
    if (roleLower.includes("doctor")) return "bg-blue-100 text-blue-700";
    if (roleLower.includes("nurse")) return "bg-pink-100 text-pink-700";
    if (roleLower.includes("lab")) return "bg-amber-100 text-amber-700";
    if (roleLower.includes("pharmacist"))
      return "bg-emerald-100 text-emerald-700";
    if (roleLower.includes("finance")) return "bg-cyan-100 text-cyan-700";
    return "bg-slate-100 text-slate-700";
  };

  const buttonMotion = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300 },
  };
  const buttonStyle =
    "hover:bg-[#9DCEF8] px-4 py-2 rounded-full text-[#005CBB] font-bold flex items-center gap-2 transition-colors duration-300 text-sm cursor-pointer border-none shadow-sm bg-white";

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

  // --- Handlers ---
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
      console.log("Registration Success Response:", response);
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
  // const handleAddUser = async (e) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);

  //     const formData = new FormData(e.currentTarget);
  //     const file = fileInputRef.current?.files[0];
  //     if (file) formData.append("avatar", file);

  //     try {
  //       const response = await registerStaff(formData);
  //       toast.success("Staff registered successfully!");

  //       // Ensure we push the new staff object into the array
  //       // Depending on your backend, the new user is usually in response.data or just response
  //       const newStaff = response?.data || response;

  //       if (newStaff && typeof newStaff === 'object') {
  //         setUsers((prev) => [newStaff, ...prev]);
  //       }

  //       handleClose();
  //     } catch (err) {
  //       toast.error(err.message || "Registration failed");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const stats = [
    {
      title: "Total Staff",
      value: users.length,
      color: "blue",
    },
    {
      title: "On Duty Now", // <--- The new critical metric
      value: 0,
      color: "purple",
    },
    {
      title: "Active Accounts",
      value: 0,
      color: "green",
    },
    {
      title: "Suspended",
      value: 0,
      color: "red",
    },
  ];

  return (
    <div className="px-4">
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2
            className={`text-2xl font-black capitalize ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            User Management
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            Configure staff access and system permissions
          </p>
        </div>

        <motion.button
          {...buttonMotion}
          onClick={() => setIsModalOpen(true)}
          className={buttonStyle}
        >
          <AiOutlineUserAdd size={18} /> Add New Staff
        </motion.button>
      </div>

      {/* 2. Quick Stats Section */}
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((stat, index) => (
          <Col
            xs={24} // 1 card per row on mobile
            sm={12} // 2 cards per row on tablets
            lg={6} // 4 cards per row on desktop (24 / 4 = 6)
            key={index}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          </Col>
        ))}
      </Row>

      <Card className="rounded-md border-none overflow-hidden p-0 bg-white">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-md flex items-center">
            {/* The Icon */}
            <img
              src="/search.png"
              alt="Search"
              className="absolute left-4 w-5 h-5 object-contain pointer-events-none opacity-50"
            />

            {/* The Input */}
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border rounded-lg border-gray-300 cursor-pointer"
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="record_officer">Record Officer</option>
              <option value="lab_officer">Lab Scientist</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[12px] uppercase tracking-wider border-b border-gray-100 font-bold text-slate-500">
                  Member
                </th>
                <th className="px-6 py-4 text-[12px] uppercase tracking-wider border-b border-gray-100 font-bold text-slate-500">
                  Role
                </th>
                <th className="px-6 py-4 text-[12px] uppercase tracking-wider border-b border-gray-100 font-bold text-slate-500">
                  Department
                </th>
                <th className="px-6 py-4 text-[12px] uppercase tracking-wider border-b border-gray-100 font-bold text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-[12px] uppercase tracking-wider border-b border-gray-100 font-bold text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[12px] uppercase tracking-wider border-b border-gray-100 w-1 whitespace-nowrap font-bold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <SkeletonRows />
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 shrink-0 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              className="h-full w-full object-cover"
                              alt=""
                            />
                          ) : (
                            <span className="text-blue-600 text-sm font-bold">
                              {user.firstName[0]}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate leading-tight">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleStyles(user.role)}`}
                      >
                        {user.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm text-slate-600 font-medium">
                        {user.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="text-sm text-slate-600 font-medium">
                        {user.phoneNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div
                        className={`inline-flex font-bold text-[10px] items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-wide ${
                          user.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                        />
                        {user.isActive ? "Active" : "Suspended"}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right w-1 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-orange-50 rounded-lg transition-colors group/btn">
                          <RiKey2Line className="text-lg text-slate-400 group-hover/btn:text-orange-500" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn">
                          <RiEditLine className="text-lg text-slate-400 group-hover/btn:text-blue-500" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors group/btn">
                          {user.isActive ? (
                            <RiUserForbidLine className="text-lg text-slate-400 group-hover/btn:text-red-500" />
                          ) : (
                            <RiUserFollowLine className="text-lg text-slate-400 group-hover/btn:text-green-500" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                      No members found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Add User Modal */}
      <Modal
        title="Register New Staff"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default User;

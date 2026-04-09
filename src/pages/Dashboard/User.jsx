import React, { useState, useRef, useEffect, use } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Card,
  Input,
  Form,
  Select,
  Tooltip,
  Badge,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Statistic,
} from "antd";
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

const { Option } = Select;

// --- Mock Data ---
const MOCK_USERS = [
  {
    _id: "1",
    firstName: "System",
    lastName: "Admin",
    email: "admin@medflow.com",
    role: "admin",
    department: "IT",
    isActive: true,
    lastLogin: "2 mins ago",
  },
  {
    _id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "s.johnson@medflow.com",
    role: "doctor",
    department: "Cardiology",
    isActive: true,
    lastLogin: "1 hour ago",
  },
  {
    _id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@medflow.com",
    role: "lab_officer",
    department: "Diagnostics",
    isActive: false,
    lastLogin: "2 days ago",
  },
  {
    _id: "4",
    firstName: "Janet",
    lastName: "Okon",
    email: "j.okon@medflow.com",
    role: "record_officer",
    department: "Admin",
    isActive: true,
    lastLogin: "5 mins ago",
  },
];

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

  //   useEffect(() => {
  //   const fetchStaff = async () => {
  //     try {
  //       const data = await getStaff();
  //       setUsers(data);
  //     } catch (err) {
  //       toast.error("Could not load staff list");
  //     }
  //   };
  //   fetchStaff();
  // }, [getStaff]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getStaff();
        // console.log(response)
        // Extract the array from the object structure: { staffMembers: [], totalStaff: 0 }
        const staffArray = response?.staffMembers || [];
        setUsers(staffArray);
      } catch (err) {
        toast.error("Could not load staff list");
        setUsers([]); // Fallback to empty array
      }
    };
    fetchStaff();
  }, [getStaff]);

//   console.log(users);

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

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)),
    );
  };

  // --- Columns Configuration ---
  const columns = [
    {
      title: "Staff Member",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${record.isActive ? "bg-blue-600" : "bg-gray-400"}`}
          >
           <img
              src={record.avatar || "https://via.placeholder.com/40?text=NA"}
              alt={`${record.firstName} ${record.lastName}`} />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-[11px] text-slate-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "System Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colors = {
          admin: "volcano",
          doctor: "blue",
          lab_officer: "purple",
          record_office: "cyan",
        };
        return (
          <Tag
            color={colors[role]}
            className="uppercase font-bold text-[9px] px-2 rounded-md border-none"
          >
            {role.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => (
        <span className="text-xs text-slate-500 font-medium">{text}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <span className="text-xs text-slate-500 font-medium">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (active) => (
        <Badge
          status={active ? "success" : "error"}
          text={
            <span className="text-xs font-semibold">
              {active ? "Active" : "Suspended"}
            </span>
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Reset Password">
            <Button
              type="text"
              icon={
                <RiKey2Line className="text-slate-400 hover:text-orange-500" />
              }
            />
          </Tooltip>
          <Tooltip title="Edit Profile">
            <Button
              type="text"
              icon={
                <RiEditLine className="text-slate-400 hover:text-blue-500" />
              }
            />
          </Tooltip>
          <Tooltip title={record.isActive ? "Suspend" : "Activate"}>
            <Button
              type="text"
              onClick={() => toggleStatus(record._id)}
              icon={
                record.isActive ? (
                  <RiUserForbidLine className="text-red-400" />
                ) : (
                  <RiUserFollowLine className="text-green-500" />
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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

      {/* 3. Filter & Table Card */}
      <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <Input
            prefix={<RiSearchLine className="text-slate-300" />}
            placeholder="Search by name or email..."
            className="rounded-2xl h-12 bg-slate-50 border-none max-w-md"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase">
            <RiFilter3Line /> Filter By Role:
            <Select
              defaultValue="all"
              className="w-40 h-10 border-none bg-slate-50 rounded-xl"
            >
              <Option value="all">All Staff</Option>
              <Option value="doctor">Doctors</Option>
              <Option value="admin">Admins</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          className="custom-table"
        />
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

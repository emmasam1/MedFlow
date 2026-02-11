import React, { useState } from "react";
import { Breadcrumb, Typography, Tabs } from "antd";
import { Link } from "react-router-dom";
import { TbHomeCheck, TbPhoneCall } from "react-icons/tb";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { RiInformationLine, RiSettings3Line } from "react-icons/ri";
import About from "./About";

const UserProfile = () => {
  const [currentTab, setCurrentTab] = useState("About");

  const tabs = [
    { label: "About", icon: <RiInformationLine size={18} /> },
    { label: "Settings", icon: <RiSettings3Line size={18} /> },
  ];
  const doctorProfile = {
    id: 1,
    name: "Dr. Ella John",
    specialty: "Cardiology",
    age: 42,
    gender: "Female",
    experienceYears: 15,
    contact: {
      email: "jane.smith@hospital.com",
      phone: "+1234567890",
    },
    address: {
      street: "123 Heartbeat Lane",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    availability: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    ratings: 4.8,
    languages: ["English", "Spanish"],
    bio: "Dr. Jane Smith is a highly experienced cardiologist specializing in heart health and patient care. She has been practicing for over 15 years and is committed to improving patient outcomes through advanced treatments.",
  };

  const [activeTab, setActiveTab] = React.useState("1");

  const items = [
    {
      key: "1",
      label: "About",
      children: (
        <motion.div
          key="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {doctorProfile.bio}
        </motion.div>
      ),
    },
    {
      key: "2",
      label: "Availability",
      children: (
        <motion.div
          key="availability"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="list-disc ml-5">
            {Object.entries(doctorProfile.availability).map(([day, hours]) => (
              <li key={day}>
                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                {hours}
              </li>
            ))}
          </ul>
        </motion.div>
      ),
    },
  ];

  const onChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <Link to="/dashboard">Dashboard</Link> },
          { title: "User Profile" },
        ]}
      />

      <div className="flex flex-col md:flex-row gap-4 mt-3">
        {/* Left Column */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-xl">
            <div className="bg-[#212529] relative flex justify-center h-40">
              <div className="flex flex-col items-center">
                <Typography.Title level={3} className="text-white! pt-4 m-0!">
                  {doctorProfile.name}
                </Typography.Title>
                <p className="text-white">{doctorProfile.specialty}</p>
              </div>
              <img
                src="/admin.jpg"
                alt="Doctor Profile"
                className="w-30 h-30 object-cover rounded-full absolute top-20"
              />
            </div>

            <div className="p-4 mt-9 flex flex-col items-center">
              <div className="flex items-center">
                <TbHomeCheck size={20} className="inline-block mr-2" />
                <p className="text-center">
                  {doctorProfile.address?.street}, {doctorProfile.address?.city}
                  , {doctorProfile.address?.state}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <MdOutlineMarkEmailRead
                    size={20}
                    className="inline-block mr-2"
                  />
                  <p className="text-center">{doctorProfile.contact?.email}</p>
                </div>
                <div className="flex items-center justify-center">
                  <TbPhoneCall size={20} className="inline-block mr-2" />
                  <p className="text-center">{doctorProfile.contact?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg mt-5">
            <AnimatePresence mode="wait">
              <Tabs
                activeKey={activeTab}
                items={items}
                onChange={onChange}
                type="card"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 bg-white rounded-xl p-6">
          {/* Tab Buttons */}
          <div className="flex bg-gray-100 rounded-full p-1 relative w-fit">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.label;

              return (
                <motion.button
                  key={tab.label}
                  onClick={() => setCurrentTab(tab.label)}
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`relative flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium overflow-hidden`}
                  animate={{
                    paddingLeft: isActive ? 28 : 20,
                    paddingRight: isActive ? 28 : 20,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-highlight"
                      className="absolute inset-0 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Animated Tab Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {currentTab === "About" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className=""
                >
                  <About />
                </motion.div>
              )}

              {currentTab === "Settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 border rounded-xl shadow-sm"
                >
                  <p>Settings content goes here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

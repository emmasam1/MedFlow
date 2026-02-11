import React, { useState } from "react";
import { useStore } from "../store/store";

const Settings = () => {
  const { darkMode, setDarkMode, isSidebarOpen, toggleSidebar } = useStore();

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    // add your password validation and submission logic here
    alert("Password updated successfully!");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Security Section */}
      <div className="bg-white shadow rounded p-6 transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-bold mb-4">Security</h2>
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={security.currentPassword}
              onChange={handleSecurityChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={security.newPassword}
              onChange={handleSecurityChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={security.confirmPassword}
              onChange={handleSecurityChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-300"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="bg-white shadow rounded p-6 transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-bold mb-4">Theme Settings</h2>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="h-5 w-5"
          />
        </div>
      </div>

      {/* Sidebar Settings */}
      <div className="bg-white shadow rounded p-6 transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-bold mb-4">Sidebar Settings</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700">Sidebar Open</span>
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors duration-300"
          >
            {isSidebarOpen ? "Close" : "Open"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Sidebar Theme</span>
          <select className="border border-gray-300 rounded p-1">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white shadow rounded p-6 transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Dr. Ella John"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="ella@hospital.com"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="+123456789"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-300">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

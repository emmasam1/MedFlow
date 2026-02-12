import React, { useState } from "react";

const Settings = () => {
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
    <div>
      {/* Security Section */}
      <div className="p-6 transition-all duration-500">
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
    </div>
  );
};

export default Settings;

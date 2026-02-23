import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);

  console.log(patient);

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        patientType: capitalizeFirstLetter(patient.patientType),
        gender: capitalizeFirstLetter(patient.gender),
        nextOfKin: {
          ...patient.nextOfKin,
          relationship: capitalizeFirstLetter(patient.nextOfKin?.relationship),
        },
      });
    }
  }, [patient]);

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  if (!formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("nextOfKin.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        nextOfKin: {
          ...formData.nextOfKin,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const patientTypes = ["Single", "Family", "NHIS", "KACHMA"];

  const relationshipTypes = [
    "Spouse",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Son",
    "Daughter",
    "Guardian",
  ];

  const getNormalizedRelationship = (rel) => {
    if (!rel) return "";
    if (rel.toLowerCase() === "wife" || rel.toLowerCase() === "husband")
      return "Spouse";
    return rel;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* ================= HEADER (FIXED) ================= */}
        <div className="flex items-center justify-between px-6 py-4 ">
          <div className="flex">
            <h2 className="text-lg font-semibold">Edit Patient</h2> &nbsp; -
            &nbsp;
            <p className="text-lg font-bold">{formData.fullName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium capitalize">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Age</label>
              <input
                type="number"
                name="age"
                readOnly
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Patient Type</label>
              <select
                name="patientType"
                value={formData.patientType.toLowerCase()}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {patientTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium capitalize">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full capitalize px-3 py-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
          </div>

          {/* Next of Kin */}
          <div>
            <h3 className="text-md font-semibold pb-2">
              Next of Kin Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                name="nextOfKin.name"
                value={formData.nextOfKin?.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg capitalize"
              />

              <select
                name="nextOfKin.relationship"
                value={formData.nextOfKin?.relationship.toLowerCase()}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Relationship</option>
                {relationshipTypes.map((rel) => (
                  <option key={rel} value={rel.toLowerCase()}>
                    {rel}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="nextOfKin.phone"
                value={formData.nextOfKin?.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <textarea
              name="nextOfKin.address"
              value={formData.nextOfKin?.address}
              onChange={handleChange}
              placeholder="Address"
              rows={2}
              className="w-full capitalize px-3 py-2 border border-gray-300 rounded-lg resize-none mt-4"
            />
          </div>
        </div>

        {/* ================= FOOTER (FIXED) ================= */}
        <div className="flex justify-end gap-3 px-6 py-4 ">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;

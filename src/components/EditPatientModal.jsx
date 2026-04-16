import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useStore } from "../store/store";

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const { darkMode } = useStore();
  const [formData, setFormData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);

  const familyRelationshipTypes = [
    "Wife",
    "Husband",
    "Child",
    "Son",
    "Daughter",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Dependent",
  ];

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // console.log(patient)

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

      setFamilyMembers(patient.familyMembers || []);
    }
  }, [patient]);

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

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", relationship: "" }]);
  };

  const removeFamilyMember = (index) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updated);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
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

  const showFamilyInputs = formData.patientType.toLowerCase() !== "single";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      {/* MODAL */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 text-gray-100 border border-gray-700"
            : "bg-white text-gray-900 border border-gray-300"
        } w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Edit Patient</h2> -
            <p className="font-bold capitalize">{formData.firstName} {formData.lastName}</p>
          </div>

          <button
            onClick={onClose}
            className={`${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } p-2 rounded-full transition cursor-pointer`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Number */}
            <div>
              <label className="text-sm font-medium">Card Number</label>
              <input
                type="text"
                value={formData.patientId}
                disabled
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-gray-100 border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg capitalize`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-medium">Age</label>
              <input
                type="number"
                value={formData.age}
                readOnly
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>

            {/* Patient Type */}
            <div>
              <label className="text-sm font-medium">Patient Type</label>
              <select
                name="patientType"
                value={formData.registrationType.toLowerCase()}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              >
                {patientTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAMILY MEMBERS */}
          {showFamilyInputs && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Family Members</h3>

                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="text-blue-600 font-medium cursor-pointer"
                >
                  + Add Member
                </button>
              </div>

              <div className="space-y-3">
                {familyMembers.map((member, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={member.name}
                      onChange={(e) =>
                        handleFamilyChange(index, "name", e.target.value)
                      }
                      className={`${
                        darkMode
                          ? "bg-gray-700 border border-gray-600 text-gray-100"
                          : "bg-white border border-gray-300 text-gray-900"
                      } w-full px-3 py-2 rounded-lg`}
                    />

                    <div className="relative">
                      <select
                        value={member.relationship}
                        onChange={(e) =>
                          handleFamilyChange(
                            index,
                            "relationship",
                            e.target.value,
                          )
                        }
                        className={`${
                          darkMode
                            ? "bg-gray-700 border border-gray-600 text-gray-100"
                            : "bg-white border border-gray-300 text-gray-900"
                        } w-full px-3 py-2 rounded-lg`}
                      >
                        <option value="">Select Relationship</option>

                        {familyRelationshipTypes.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeFamilyMember(index)}
                        className="absolute -right-5 cursor-pointer top-3 text-red-500 hover:text-red-700 "
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHONE + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100"
                    : "bg-white border border-gray-300 text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={`${
                darkMode
                  ? "bg-gray-700 border border-gray-600 text-gray-100"
                  : "bg-white border border-gray-300 text-gray-900"
              } w-full px-3 py-2 rounded-lg resize-none`}
            />
          </div>
          {/** Next of Kin */}
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
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                    : "bg-white border-gray-300 border text-gray-900"
                } w-full px-3 py-2 rounded-lg capitalize`}
              />

              <select
                name="nextOfKin.relationship"
                value={formData.nextOfKin?.relationship?.toLowerCase() || ""}
                onChange={handleChange}
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 border text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
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
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 border text-gray-900"
                } w-full px-3 py-2 rounded-lg`}
              />
            </div>

            <textarea
              name="nextOfKin.address"
              value={formData.nextOfKin?.address}
              onChange={handleChange}
              placeholder="Address"
              rows={2}
              className={`${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                  : "bg-white border-gray-300 border text-gray-900"
              } w-full px-3 py-2 rounded-lg resize-none mt-4`}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`${
              darkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            } px-4 py-2 rounded-lg`}
          >
            Cancel
          </button>

          <button
           onClick={() => onSave({ ...formData, familyMembers })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;

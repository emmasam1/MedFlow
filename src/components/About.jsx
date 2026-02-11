import React from "react";

const About = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-gray-800">Full Name</h2>
          <p className="text-sm font-semibold text-gray-600">Dr. Ella John</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-gray-800">Mobile</h2>
          <p className="text-sm font-semibold text-gray-600">+1234567890</p>
        </div>
        <div className="p-4 bg-white shadow rounded break-words">
          <h2 className="font-bold text-gray-800">Email</h2>
          <p className="text-sm font-semibold text-gray-600">
            jane.smith@hospital.com
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold text-gray-800">Location</h2>
          <p className="text-sm font-semibold text-gray-600">New York</p>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-800 mt-6 mb-2">Biography</h2>
        <p className="text-sm text-gray-600">
          Dr. Ella John is a highly experienced cardiologist with over 15 years
          of practice in the field. She has a passion for patient care and is
          dedicated to providing the best possible treatment for her patients.
          Dr. John has published numerous research papers and is a respected
          member of the medical community.
        </p>
      </div>

      <div>
        <h2 className="font-bold text-gray-800 mt-6 mb-2">Education</h2>
        <p className="text-sm text-gray-600">MD, Harvard Medical School</p>
      </div>

        <div>
        <h2 className="font-bold text-gray-800 mt-6 mb-2">Experience</h2>
        <p className="text-sm text-gray-600">
          Dr. John has worked at several prestigious hospitals and has been
          recognized for her contributions to cardiology. She has a strong
          background in clinical research and has been involved in numerous
          clinical trials.
        </p>
      </div>
    </div>
  );
};

export default About;

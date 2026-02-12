// import React, { useState } from "react";
// import { Form, Input, Select, Button, Upload, Avatar } from "antd";
// import { CameraOutlined, UserOutlined } from "@ant-design/icons";
// import { motion, AnimatePresence } from "framer-motion";

// const { Option } = Select;

// const generateCardNumber = (type) => {
//   const prefix =
//     type === "nhis" ? "NHIS" :
//     type === "family" ? "FAM" :
//     "SGL";

//   return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
// };

// const AddPatients = () => {
//   const [form] = Form.useForm();
//   const [patientType, setPatientType] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);

//   const handlePatientTypeChange = (value) => {
//     setPatientType(value);
//     form.setFieldsValue({
//       cardNumber: generateCardNumber(value),
//       status: value === "single" ? "Private" : undefined,
//     });
//   };

//   const nextStep = async () => {
//     try {
//       await form.validateFields();
//       setCurrentStep((prev) => prev + 1);
//     } catch {}
//   };

//   const prevStep = () => setCurrentStep((prev) => prev - 1);

//   return (
//     <Form
//       layout="vertical"
//       form={form}
//       className="grid grid-cols-1 md:grid-cols-2 gap-6"
//     >
//       <AnimatePresence mode="wait">

//         {/* ================= STEP 1 ================= */}
//         {currentStep === 1 && (
//           <motion.div
//             key="step1"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             {/* Photo */}
//             <div className="col-span-full flex items-center gap-6">
//               <Avatar size={96} src={photo} icon={<UserOutlined />} />
//               <Upload
//                 showUploadList={false}
//                 beforeUpload={(file) => {
//                   const reader = new FileReader();
//                   reader.onload = (e) => setPhoto(e.target.result);
//                   reader.readAsDataURL(file);
//                   return false;
//                 }}
//               >
//                 <Button icon={<CameraOutlined />}>
//                   Capture / Upload Photo
//                 </Button>
//               </Upload>
//             </div>

//             <Form.Item label="First Name" name="firstName" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Address" name="address" className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Date of Birth" name="dob" className="mb-0!">
//               <Input type="date" />
//             </Form.Item>

//             <Form.Item label="Gender" name="gender" className="mb-0!">
//               <Select>
//                 <Option value="male">Male</Option>
//                 <Option value="female">Female</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Patient Type" name="type" rules={[{ required: true }]} className="mb-0!">
//               <Select onChange={handlePatientTypeChange}>
//                 <Option value="single">Single</Option>
//                 <Option value="family">Family</Option>
//                 <Option value="nhis">NHIS</Option>
//                 <Option value="kadcham">KADCHAM</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Card Number" name="cardNumber" className="mb-0!">
//               <Input disabled />
//             </Form.Item>

//             <Form.Item label="Status" name="status" className="mb-0!">
//               <Input disabled />
//             </Form.Item>

//             {patientType === "nhis" && (
//               <motion.div
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <Form.Item
//                   label="NHIS Insurance Number"
//                   name="insuranceNumber"
//                   rules={[{ required: true }]}
//                   className="mb-0!"
//                 >
//                   <Input />
//                 </Form.Item>
//               </motion.div>
//             )}

//             <div className="col-span-full flex justify-end">
//               <Button type="primary" onClick={nextStep}>
//                 Next: Personal Details →
//               </Button>
//             </div>
//           </motion.div>
//         )}

//         {/* ================= STEP 2 ================= */}
//         {currentStep === 2 && (
//           <motion.div
//             key="step2"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <Form.Item label="Marital Status" name="maritalStatus" rules={[{ required: true }]} className="mb-0!">
//               <Select placeholder="Select status">
//                 <Option value="single">Single</Option>
//                 <Option value="married">Married</Option>
//                 <Option value="divorced">Divorced</Option>
//                 <Option value="widowed">Widowed</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="State of Origin" name="stateOfOrigin" rules={[{ required: true }]} className="mb-0!">
//               <Input placeholder="e.g. Kaduna" />
//             </Form.Item>

//             <Form.Item label="Local Government Area (LGA)" name="lga" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Occupation" name="occupation" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <div className="col-span-full flex justify-between">
//               <Button onClick={prevStep}>← Back</Button>
//               <Button type="primary" onClick={nextStep}>
//                 Next: Next of Kin →
//               </Button>
//             </div>
//           </motion.div>
//         )}

//         {/* ================= STEP 3 ================= */}
//         {currentStep === 3 && (
//           <motion.div
//             key="step3"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <Form.Item label="Next of Kin Name" name="nokName" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Relationship" name="nokRelationship" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Phone Number" name="nokPhone" rules={[{ required: true }]} className="mb-0!">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Address" name="nokAddress" className="mb-0!">
//               <Input />
//             </Form.Item>

//             <div className="col-span-full flex justify-between">
//               <Button onClick={prevStep}>← Back</Button>
//               <Button type="primary" size="large">
//                 Register Patient
//               </Button>
//             </div>
//           </motion.div>
//         )}

//       </AnimatePresence>
//     </Form>
//   );
// };

// export default AddPatients;


import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiCameraLensLine, 
  RiUser3Line, 
  RiCloseLine, 
  RiCheckLine, 
  RiImageAddLine 
} from "react-icons/ri";
import { useStore } from "../store/store";

const generateCardNumber = (type) => {
  const prefix = type === "nhis" ? "NHIS" : type === "family" ? "FAM" : "SGL";
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

const AddPatients = () => {
  const { darkMode } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", address: "",
    dob: "", gender: "", type: "", cardNumber: "",
    status: "", insuranceNumber: "", maritalStatus: "",
    stateOfOrigin: "", lga: "", occupation: "",
    nokName: "", nokRelationship: "", nokPhone: "", nokAddress: ""
  });

  const startCamera = async () => {
    setIsCameraOpen(true);
    setPhoto(null); // Clear previous photo to show viewfinder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/png"));
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData(prev => ({
        ...prev, type: value,
        cardNumber: generateCardNumber(value),
        status: value === "single" ? "Private" : "Regular"
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const inputClass = `w-full px-3 py-1.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 
    ${darkMode 
      ? "bg-[#111827] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500" 
      : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-600"}`;

  const labelClass = `block text-[10px] font-bold uppercase tracking-widest mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`;

  return (
    <div className="w-full max-h-[85vh]">
      {/* Progress Bar - More Compact */}
      <div className="flex items-center justify-between mb-4 max-w-xs mx-auto">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`flex items-center ${step === 3 ? '' : 'flex-1'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
              ${currentStep >= step ? "bg-blue-600 border-blue-600 text-white" : (darkMode ? "bg-gray-800 border-gray-700 text-gray-600" : "bg-gray-100 border-gray-200 text-gray-400")}`}>
              {currentStep > step ? <RiCheckLine size={14}/> : step}
            </div>
            {step < 3 && <div className={`h-[1px] flex-1 mx-2 ${currentStep > step ? "bg-blue-600" : (darkMode ? "bg-gray-800" : "bg-gray-200")}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-x-4 gap-y-3">
              
              {/* Photo Section - Side Aligned to Save Height */}
              <div className="col-span-1 flex flex-col items-center">
                <div className={`w-full aspect-square max-w-[120px] rounded-xl overflow-hidden border-2 flex items-center justify-center relative
                  ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                  
                  {isCameraOpen ? (
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : photo ? (
                    <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <RiUser3Line size={32} className="text-gray-400" />
                  )}
                </div>
                
                <div className="flex flex-col w-full gap-1.5 mt-2 max-w-[120px]">
                  {!isCameraOpen ? (
                    <>
                      <button type="button" onClick={startCamera} className="text-[9px] font-bold uppercase bg-blue-600 text-white py-1.5 rounded flex items-center justify-center gap-1"><RiCameraLensLine/> Capture</button>
                      <label className="text-[9px] font-bold uppercase bg-gray-500 text-white py-1.5 rounded cursor-pointer flex items-center justify-center gap-1"><RiImageAddLine/> Upload <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*"/></label>
                    </>
                  ) : (
                    <div className="flex gap-1">
                      <button type="button" onClick={capturePhoto} className="flex-1 text-[9px] font-bold uppercase bg-green-600 text-white py-1.5 rounded">Snap</button>
                      <button type="button" onClick={stopCamera} className="bg-red-600 text-white p-1.5 rounded"><RiCloseLine size={12}/></button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Inputs - 2/3 of the row */}
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div><label className={labelClass}>First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Gender</label><select name="gender" onChange={handleChange} className={inputClass}><option>Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                <div><label className={labelClass}>Type</label><select name="type" onChange={handleChange} className={inputClass}><option>Select</option><option value="single">Single</option><option value="family">Family</option><option value="nhis">NHIS</option></select></div>
              </div>

              <div className="col-span-3 grid grid-cols-3 gap-3">
                <div><label className={labelClass}>Card Number</label><input name="cardNumber" value={formData.cardNumber} className={`${inputClass} opacity-60 bg-transparent`} disabled /></div>
                <div><label className={labelClass}>Status</label><input name="status" value={formData.status} className={`${inputClass} opacity-60 bg-transparent`} disabled /></div>
                {formData.type === "nhis" && (
                  <div className="col-span-1"><label className={labelClass}>Insurance #</label><input name="insuranceNumber" onChange={handleChange} className={inputClass} /></div>
                )}
              </div>

              <div className="col-span-3 flex justify-end mt-2"><button onClick={() => setCurrentStep(2)} className="bg-blue-600 text-white px-5 py-1.5 rounded-lg text-sm font-bold">Continue →</button></div>
            </motion.div>
          )}

          {/* STEP 2: Personal Details */}
          {currentStep === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Marital Status</label><select name="maritalStatus" onChange={handleChange} className={inputClass}><option>Select</option><option value="single">Single</option><option value="married">Married</option></select></div>
              <div><label className={labelClass}>Origin State</label><input name="stateOfOrigin" onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>LGA</label><input name="lga" onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Occupation</label><input name="occupation" onChange={handleChange} className={inputClass} /></div>
              <div className="col-span-full"><label className={labelClass}>Address</label><textarea name="address" onChange={handleChange} className={`${inputClass} h-16 resize-none`} /></div>
              <div className="col-span-full flex justify-between mt-2">
                <button onClick={() => setCurrentStep(1)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}>← Back</button>
                <button onClick={() => setCurrentStep(3)} className="bg-blue-600 text-white px-5 py-1.5 rounded-lg text-sm font-bold">Continue →</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Next of Kin */}
          {currentStep === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
              <div className="col-span-full border-b dark:border-gray-800 pb-1 mb-1"><h3 className="text-[10px] font-bold uppercase text-blue-500">Next of Kin</h3></div>
              <div><label className={labelClass}>Full Name</label><input name="nokName" onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Relationship</label><input name="nokRelationship" onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input name="nokPhone" onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Address</label><input name="nokAddress" onChange={handleChange} className={inputClass} /></div>
              <div className="col-span-full flex justify-between mt-4">
                <button onClick={() => setCurrentStep(2)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}>← Back</button>
                <button className="bg-green-600 text-white px-6 py-1.5 rounded-lg text-sm font-bold">Finish Registration</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default AddPatients;
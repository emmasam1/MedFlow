import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Avatar } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;

const generateCardNumber = (type) => {
  const prefix =
    type === "nhis" ? "NHIS" :
    type === "family" ? "FAM" :
    "SGL";

  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

const AddPatients = () => {
  const [form] = Form.useForm();
  const [patientType, setPatientType] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handlePatientTypeChange = (value) => {
    setPatientType(value);
    form.setFieldsValue({
      cardNumber: generateCardNumber(value),
      status: value === "single" ? "Private" : undefined,
    });
  };

  const nextStep = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch {}
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <Form
      layout="vertical"
      form={form}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <AnimatePresence mode="wait">

        {/* ================= STEP 1 ================= */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Photo */}
            <div className="col-span-full flex items-center gap-6">
              <Avatar size={96} src={photo} icon={<UserOutlined />} />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => setPhoto(e.target.result);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<CameraOutlined />}>
                  Capture / Upload Photo
                </Button>
              </Upload>
            </div>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Patient Type" name="type" rules={[{ required: true }]} className="mb-0!">
                <Select onChange={handlePatientTypeChange}>
                  <Option value="single">Single</Option>
                  <Option value="family">Family</Option>
                  <Option value="nhis">NHIS</Option>
                  <Option value="kadcham">KADCHAM</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Card Number" name="cardNumber" className="mb-0!">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Status" name="status" className="mb-0!">
                <Input disabled />
              </Form.Item>
            </div>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]} className="mb-0!">
                <Input />
              </Form.Item>

              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]} className="mb-0!">
                <Input />
              </Form.Item>

              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]} className="mb-0!">
                <Input />
              </Form.Item>
            </div>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Address" name="address" className="mb-0!">
                <Input />
              </Form.Item>

              <Form.Item label="Date of Birth" name="dob" className="mb-0!">
                <Input type="date" />
              </Form.Item>

              <Form.Item label="Gender" name="gender" className="mb-0!">
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </div>

            {patientType === "nhis" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Form.Item
                  label="NHIS Insurance Number"
                  name="insuranceNumber"
                  rules={[{ required: true }]}
                  className="mb-0!"
                >
                  <Input />
                </Form.Item>
              </motion.div>
            )}

            <div className="col-span-full flex justify-end">
              <Button type="primary" onClick={nextStep}>
                Next: Personal Details →
              </Button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2 ================= */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Form.Item label="Marital Status" name="maritalStatus" rules={[{ required: true }]} className="mb-0!">
              <Select placeholder="Select status">
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
                <Option value="widowed">Widowed</Option>
              </Select>
            </Form.Item>

            <Form.Item label="State of Origin" name="stateOfOrigin" rules={[{ required: true }]} className="mb-0!">
              <Input placeholder="e.g. Kaduna" />
            </Form.Item>

            <Form.Item label="Local Government Area (LGA)" name="lga" rules={[{ required: true }]} className="mb-0!">
              <Input />
            </Form.Item>

            <Form.Item label="Occupation" name="occupation" rules={[{ required: true }]} className="mb-0!">
              <Input />
            </Form.Item>

            <div className="col-span-full flex justify-between">
              <Button onClick={prevStep}>← Back</Button>
              <Button type="primary" onClick={nextStep}>
                Next: Next of Kin →
              </Button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3 ================= */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Form.Item label="Next of Kin Name" name="nokName" rules={[{ required: true }]} className="mb-0!">
              <Input />
            </Form.Item>

            <Form.Item label="Relationship" name="nokRelationship" rules={[{ required: true }]} className="mb-0!">
              <Input />
            </Form.Item>

            <Form.Item label="Phone Number" name="nokPhone" rules={[{ required: true }]} className="mb-0!">
              <Input />
            </Form.Item>

            <Form.Item label="Address" name="nokAddress" className="mb-0!">
              <Input />
            </Form.Item>

            <div className="col-span-full flex justify-between">
              <Button onClick={prevStep}>← Back</Button>
              <Button type="primary" size="large">
                Register Patient
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </Form>
  );
};

export default AddPatients;

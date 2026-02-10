import React, { useState } from "react";
import { Breadcrumb, Form, Input, Select, Button, Upload, Avatar } from "antd";
import { Link } from "react-router-dom";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Option } = Select;

const generateCardNumber = (type) => {
  const prefix =
    type === "nhis" ? "NHIS" : type === "family" ? "FAM" : "SGL";
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

const AddPatients = () => {
  const [form] = Form.useForm();
  const [patientType, setPatientType] = useState(null);
  const [photo, setPhoto] = useState(null);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <Link to="/dashboard">Dashboard</Link> },
          { title: "Add Patient" },
        ]}
      />

      {/* Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-3">
        <h1 className="text-xl font-bold text-gray-900">
          Patient Registration
        </h1>
        <p className="text-gray-500 mb-6">
          Fill in patient details to register a new patient
        </p>

        <Form
          layout="vertical"
          form={form}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Patient Photo */}
          <div className="md:col-span-3 flex items-center gap-6">
            <Avatar
              size={96}
              src={photo}
              icon={<UserOutlined />}
              className="border"
            />
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => setPhoto(e.target.result);
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <Button icon={<CameraOutlined />}>Capture / Upload Photo</Button>
            </Upload>
          </div>

          {/* First Name */}
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true }]}
          >
            <Input placeholder="080xxxxxxxx" />
          </Form.Item>

          {/* Address */}
          <Form.Item label="Address" name="address">
            <Input placeholder="Home address" />
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item label="Date of Birth" name="dob">
            <Input type="date" />
          </Form.Item>

          {/* Gender */}
          <Form.Item label="Gender" name="gender">
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>

          {/* Patient Type */}
          <Form.Item
            label="Patient Type"
            name="type"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select patient type"
              onChange={(value) => {
                setPatientType(value);
                form.setFieldsValue({
                  cardNumber: generateCardNumber(value),
                });
              }}
            >
              <Option value="single">Single</Option>
              <Option value="family">Family</Option>
              <Option value="nhis">NHIS</Option>
            </Select>
          </Form.Item>

          {/* Card Number */}
          <Form.Item label="Card Number" name="cardNumber">
            <Input disabled />
          </Form.Item>

          {/* NHIS Insurance Number (Conditional) */}
          {patientType === "nhis" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="md:col-span-1"
            >
              <Form.Item
                label="NHIS Insurance Number"
                name="insuranceNumber"
                rules={[
                  {
                    required: true,
                    message: "Enter NHIS insurance number",
                  },
                ]}
              >
                <Input placeholder="NHIS-XXXXXXXX" />
              </Form.Item>
            </motion.div>
          )}

          {/* Submit */}
          <div className="md:col-span-3 flex justify-end">
            <Button type="primary" size="large">
              Register Patient
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPatients;

import { motion } from "framer-motion";
import { Button, Input, Form, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

const { Title, Text } = Typography;

const Login = () => {
  const { login, loading } = useAppStore();
  const navigate = useNavigate();

const onFinish = async (values) => {
  try {
    const user = await login(values.identifier, values.password);

    message.success(`Welcome back`);
    
    // Role-based navigation logic
    // Your log shows role: "admin"
    if (user?.role === "admin" || user?.role === "record_officer") {
      navigate("/dashboard");
    } else if (user?.role === "doctor") {
      navigate("/doctor-dashboard");
    } else if (user?.role === "lab") {
      navigate("/lab-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    // If login fails, this will catch the error
    message.error(err.message);
    console.log("Login Error:", err);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#f0f7ff]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-85 bg-white rounded-2xl shadow-md p-6 border border-blue-50"
      >
        <div className="text-center mb-5">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-full mb-3 object-cover shadow-md border-2 border-blue-50"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Title level={4} className="m-0! font-black! text-gray-800">Health Flow</Title>
          <Text className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-500/80">
            Medical Management
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={<span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Staff ID or Email</span>}
            name="identifier" // This name sends 'identifier' to onFinish
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              placeholder="e.g. admin@mahvion.com"
              className="rounded-xl h-10 border-blue-50 bg-gray-50/50 focus:bg-white transition-all"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</span>}
            name="password"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password
              placeholder="••••••••"
              className="rounded-xl h-10 border-blue-50 bg-gray-50/50 focus:bg-white transition-all"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-10 font-bold bg-blue-600 rounded-xl border-none shadow-lg mt-2"
          >
            SIGN IN
          </Button>
        </Form>

        <div className="mt-6 pt-3 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-[10px] italic">
            Forgot credentials? <br />
            See <span className="text-gray-600 font-bold not-italic">IT Admin</span> physically.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
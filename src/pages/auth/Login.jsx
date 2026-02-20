
import { motion } from "framer-motion";
import { Button, Input, Form, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppstore";

const { Title, Text } = Typography;

const Login = () => {
  // Use store loading state instead of local to stay in sync
  const { login, loading } = useAppStore();
  const navigate = useNavigate();

const onFinish = async (values) => {
    try {
      const user = await login(values.username, values.password);

      sessionStorage.setItem("user", JSON.stringify(user));

      if (user?.role === "record_officer") {
        navigate("/dashboard");
      } else if (user?.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (user?.role === "lab") {
        navigate("/lab-dashboard");
      } else {
        message.warning("Role not authorized");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#f0f7ff]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[340px] bg-white rounded-[1rem] shadow-md p-4 md:p-7 border border-blue-50"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-full mb-3 object-cover shadow-md border-2 border-blue-50"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <Title level={4} className="!m-0 !font-black tracking-tight text-gray-800">
            Health Flow
          </Title>
          <Text className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-blue-500/80">
            Medical Management
          </Text>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          size="middle"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Staff ID</span>}
            name="username"
            className="mb-1"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              placeholder="e.g. jane"
              autoFocus
              className="rounded-xl h-9! border-blue-50 bg-gray-50/50 hover:border-blue-100! focus:border-blue-50! focus:bg-white! transition-all text-sm"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</span>}
            name="password"
            className="mb-3"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password
              placeholder="••••••••"
              className="rounded-xl h-9! border-blue-50 bg-gray-50/50 hover:border-blue-100! focus:border-blue-50! focus:bg-white! transition-all text-sm"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-10! font-bold bg-blue-600 hover:bg-blue-700 rounded-xl border-none shadow-lg shadow-blue-100 transition-all active:scale-[0.97]"
            >
              SIGN IN
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-[10px] leading-tight m-0 italic font-medium">
            Forgot credentials? <br />
            See <span className="text-gray-600 font-bold not-italic">IT Admin</span> physically.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

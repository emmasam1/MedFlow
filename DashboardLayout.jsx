import React, { useEffect, useMemo, useState } from "react";
import {
  PieChartOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Layout, Menu, theme, Avatar, Dropdown, Badge } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi2";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const { Header, Content, Sider } = Layout;

/* ---------------- ROLE MENUS (ORDERED) ---------------- */
const roleMenus = {
  recordOfficer: [
    {
      key: "/dashboard",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "/dashboard/patients-add",
      icon: <AiOutlineUserAdd />,
      label: "New Patient",
      path: "/dashboard/patients-add",
    },
    {
      key: "/patients/manage",
      icon: <TeamOutlined />,
      label: "Manage Patients",
      path: "/patients/manage",
    },
    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: "Appointments",
      path: "/appointments",
    },
  ],
};

/* ---------------- DROPDOWN ---------------- */
const dropdownItems = [
  {
    key: "profile",
    label: (
      <Link to="/user-profile" className="flex items-center gap-2">
        <FiUser /> Profile
      </Link>
    ),
  },
  {
    key: "settings",
    label: (
      <div className="flex items-center gap-2">
        <FiSettings /> Settings
      </div>
    ),
  },
  { type: "divider" },
  {
    key: "logout",
    label: (
      <div className="flex items-center gap-2 text-red-600">
        <FiLogOut /> Logout
      </div>
    ),
  },
];

const DashboardLayout = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userRole = "recordOfficer";
  const menus = roleMenus[userRole];

  /* ---------- ACTIVE MENU (LONGEST MATCH) ---------- */
  const selectedKey = useMemo(() => {
    const sorted = [...menus].sort((a, b) => b.path.length - a.path.length);

    const match = sorted.find((item) =>
      location.pathname.startsWith(item.path),
    );

    return match ? [match.key] : [];
  }, [location.pathname, menus]);

  /* ---------- AUTO COLLAPSE ---------- */
  useEffect(() => {
    const resize = () => setCollapsed(window.innerWidth < 1024);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <Layout className="h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sider
        width={220}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        className="shadow-md"
        style={{ position: "fixed", inset: 0 }}
      >
        <motion.div
          className="h-16 flex items-center justify-center text-xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          MedFlow
        </motion.div>

        <Menu
          mode="inline"
          selectedKeys={selectedKey}
          className="role-menu"
          items={menus.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>,
          }))}
        />
      </Sider>

      {/* MAIN */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 220,
          transition: "margin-left 0.25s",
        }}
      >
        {/* HEADER */}
        <Header
          style={{
            background: token.colorBgContainer,
            padding: "0 24px",
            position: "fixed",
            left: collapsed ? 80 : 220,
            right: 0,
            top: 0,
            height: 64,
            zIndex: 100,
            transition: "left 0.25s",
          }}
        >
          <div className="flex items-center justify-between h-full">
            <h1 className="font-semibold text-lg">Dashboard</h1>

            <div className="flex items-center gap-4">
              <Badge count={4}>
                <HiOutlineBell size={22} />
              </Badge>

              <div className=" hover:bg-[#9DCEF8]! cursor-pointer py-1 px-3 rounded-full">
                <Dropdown menu={{ items: dropdownItems }}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium">Ella John</span>
                    <Avatar icon={<img src="/admin.jpg" alt="avatar" className="rounded-full" />}/>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            marginTop: 64,
            padding: 24,
            background: "#F0F3FB",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

import React from "react";
import Login from "./pages/auth/Login";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile";
import Appointment from "./pages/Dashboard/Appointment";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/appointment" element={<Appointment />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

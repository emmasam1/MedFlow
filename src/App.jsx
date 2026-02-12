import React from "react";
import Login from "./pages/auth/Login";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile";
import Appointment from "./pages/Dashboard/Appointment";
import Test from "./pages/Dashboard/Test";
import Patients from "./pages/Dashboard/Patients";

import Test from "./pages/Dashboard/Test";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/appointment" element={<Appointment />} />
          <Route path="/dashboard/patients" element={<Patients />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/dashboard/test" element={<Test />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

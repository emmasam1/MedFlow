import React from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Appointment from "./pages/Dashboard/Appointment";
import Queue from "./pages/Dashboard/Queue";
import Patients from "./pages/Dashboard/Patients";
import PatientProfile from "./pages/Dashboard/PatientProfile";
import Notification from "./pages/Dashboard/Notification";
import UserProfile from "./components/UserProfile";
import Unauthorized from "./pages/Dashboard/Unauthorized";

// Layout & Protection
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import FinancePayments from "./pages/Dashboard/FinancePayments";
import Transactions from "./pages/Dashboard/Transactions";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["doctor","record_officer","specialist","finance_officer"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard home */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor","record_officer","specialist","finance_officer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Appointments (only record officer can access) */}
          <Route
            path="/dashboard/appointment"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "specialist"]}>
                <Appointment />
              </ProtectedRoute>
            }
          />

          {/* Queue (only record officer can access) */}
          <Route
            path="/dashboard/queue"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "doctor"]}>
                <Queue />
              </ProtectedRoute>
            }
          />

          {/* Finance (only finance officer can access) */}
          <Route
            path="/dashboard/finance"
            element={
              <ProtectedRoute allowedRoles={["finance_officer"]}>
                <FinancePayments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/transactions"
            element={
              <ProtectedRoute allowedRoles={["finance_officer"]}>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* Patients (only record officer can access) */}
          <Route
            path="/dashboard/patients"
            element={
              <ProtectedRoute allowedRoles={["record_officer"]}>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* Patient Profile (only record officer can access) */}
          <Route
            path="/dashboard/patient-profile/:id"
            element={
              <ProtectedRoute allowedRoles={["record_officer"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* Notifications (accessible to all dashboard users) */}
          <Route
            path="/dashboard/notifications/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor","record_officer","specialist","finance_officer"]}>
                <Notification />
              </ProtectedRoute>
            }
          />

          {/* User Profile (accessible to all dashboard users) */}
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute allowedRoles={["doctor","record_officer","specialist","finance_officer"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized fallback */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
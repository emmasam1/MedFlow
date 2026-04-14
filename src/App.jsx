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
// import LabRequest from "./pages/Dashboard/LabRequest";
import User from "./pages/Dashboard/User";
import ShiftManagement from "./pages/Dashboard/ShiftManagement";
import Departments from "./pages/Dashboard/Departments";
import InstallPWA from "./components/InstallPWA";

const App = () => {
  // Common list for all authorized dashboard users
  const ALL_ROLES = ["doctor", "record_officer", "specialist", "finance_officer", "nurse", "lab_officer", "admin"];

  return (
    <>
      <ScrollToTop />
      <InstallPWA />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 1. Dashboard home (Accessible to Everyone) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 2. User Management (Strictly Admin) */}
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Departments />
              </ProtectedRoute>
            }
          />

           {/* 2. Shift Management (Strictly Admin) */}
           <Route
            path="/dashboard/shifts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ShiftManagement />
              </ProtectedRoute>
            }
          />

          {/* 3. Appointments (Record Officer + Admin should see this) */}
          <Route
            path="/dashboard/appointment"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "specialist", "admin"]}>
                <Appointment />
              </ProtectedRoute>
            }
          />

          {/* 4. Queue (Added 'admin' so they can monitor traffic) */}
          <Route
            path="/dashboard/queue"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "doctor", "nurse", "admin"]}>
                <Queue />
              </ProtectedRoute>
            }
          />

          {/* 5. Finance (Added 'admin' for oversight) */}
          <Route
            path="/dashboard/finance"
            element={
              <ProtectedRoute allowedRoles={["finance_officer", "admin"]}>
                <FinancePayments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/transactions"
            element={
              <ProtectedRoute allowedRoles={["finance_officer", "admin"]}>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* 6. Patients (Record Officer, Doctor, and Nurse usually need this) */}
          <Route
            path="/dashboard/patients"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "doctor", "nurse", "admin"]}>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* 7. Patient Profile */}
          <Route
            path="/dashboard/patient-profile/:id"
            element={
              <ProtectedRoute allowedRoles={["record_officer", "doctor", "nurse", "admin"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* 8. Lab_Officer */}
          {/* <Route
            path="/dashboard/lab-requests"
            element={
              <ProtectedRoute allowedRoles={["lab_officer", "doctor", "admin"]}>
                <LabRequest />
              </ProtectedRoute>
            }
          /> */}

          {/* 9. Global Profile & Notifications (Everyone) */}
          <Route
            path="/dashboard/notifications/:id"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Notification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-profile"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
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
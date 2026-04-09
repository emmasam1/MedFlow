import { Navigate, useLocation } from "react-router-dom";
import Unauthorized from "../pages/Dashboard/Unauthorized";
import { useAppStore } from "../store/useAppStore"; // Import your store

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Use the store instead of JSON.parse(sessionStorage...)
  const user = useAppStore((state) => state.user);
  const location = useLocation();

  // 1. If no user is in the store, redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. If user exists but doesn't have the right role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Unauthorized redirectPath={location.pathname} />;
  }

  // 3. Everything is fine, render the dashboard content
  return children;
};

export default ProtectedRoute;
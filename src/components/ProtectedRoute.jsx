import { Navigate, useLocation } from "react-router-dom";
import Unauthorized from "../pages/Dashboard/Unauthorized";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role not allowed
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Unauthorized redirectPath={location.pathname} />;
  }

  return children;
};

export default ProtectedRoute;
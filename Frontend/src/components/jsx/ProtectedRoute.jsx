import { Navigate } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) return <Navigate to="/Login" replace />;
  if (allowedRoles && !allowedRoles.includes(getUserRole())) return <Navigate to="/" replace />;
  return children;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={admin ? "/admin-login" : "/login"} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/admin-login" replace />;
  return <Outlet />;
}

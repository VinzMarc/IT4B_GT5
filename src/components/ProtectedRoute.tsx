import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ redirectTo = "/login" }: { redirectTo?: string }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  return isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

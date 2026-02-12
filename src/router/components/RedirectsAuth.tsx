import { useAuthStore } from "@/utility";
import { getRoleDefaultPath } from "./roleRedirects";
import { Navigate } from "react-router";

export const RootRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    const defaultPath = getRoleDefaultPath(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  return <Navigate to="/login" replace />;
};
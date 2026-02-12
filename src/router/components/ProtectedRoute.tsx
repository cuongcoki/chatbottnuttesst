// components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/utility/stores/authStore";
import { isPathAllowedForRole } from "./roleRedirects";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // ✅ Not authenticated → redirect to login
    if (!isAuthenticated || !user) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    // ✅ Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/not-authorized", { replace: true });
      return;
    }

    // ✅ Check if user can access this path
    if (!isPathAllowedForRole(location.pathname, user.role)) {
      navigate("/not-authorized", { replace: true });
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, location.pathname, navigate]);

  // Don't render anything while checking/redirecting
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
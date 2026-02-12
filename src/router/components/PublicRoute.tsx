// components/auth/PublicRoute.tsx
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/utility/stores/authStore";
import { getRoleDefaultPath } from "./roleRedirects";

interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
}

const PublicRoute = ({ children, redirectIfAuthenticated = false }: PublicRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // ✅ Redirect if already authenticated
    if (redirectIfAuthenticated && isAuthenticated && user) {
      const defaultPath = getRoleDefaultPath(user.role);
      navigate(defaultPath, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, redirectIfAuthenticated, navigate]);

  // Don't render anything while redirecting
  if (isLoading) {
    return null;
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default PublicRoute;
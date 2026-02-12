// components/auth/AuthProvider.tsx
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/utility/stores/authStore";
import { Loader2 } from "lucide-react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading,  initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ✅ Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <p className="text-white dark:text-gray-100 font-medium">
            Đang kiểm tra phiên đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
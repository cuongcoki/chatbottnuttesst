// components/dialogs/SessionExpiredDialog.tsx
import { useEffect } from "react";
import { useSessionStore } from "./sessionStore";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SessionExpiredDialog = () => {
  const { isSessionExpired, hideSessionExpiredDialog } = useSessionStore();

  // Prevent scroll when dialog is open
  useEffect(() => {
    if (isSessionExpired) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSessionExpired]);

  const handleReload = () => {
    hideSessionExpiredDialog();
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Reload page
    window.location.href = "/login";
  };

  if (!isSessionExpired) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Phiên đăng nhập hết hạn
                </h2>
                <p className="text-sm text-white/80">
                  Session Expired
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Phiên làm việc của bạn đã hết hạn
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
                  </p>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <span className="font-semibold">Lưu ý:</span> Dữ liệu chưa lưu sẽ bị mất. Vui lòng lưu công việc trước khi phiên hết hạn.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
            <Button
              onClick={handleReload}
              className="w-full bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-accent)] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Đăng nhập lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredDialog;
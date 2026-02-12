import { useEffect } from "react";
import { useNotificationStore } from "@/utility/stores/notificationStore";
import { useSocket } from "./useSocket";

export const useNotification = () => {
  const { isConnected } = useSocket();
  const store = useNotificationStore();

  useEffect(() => {
    if (isConnected) {
      store.setupRealtimeListeners();
      store.fetchNotifications();
    }

    return () => {
      store.cleanupRealtimeListeners();
    };
  }, [isConnected]);

  return store;
};

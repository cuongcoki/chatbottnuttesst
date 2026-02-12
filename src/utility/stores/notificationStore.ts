import { create } from "zustand";
import NotificationAPI from "@/infra/api/NotificationAPI";
import {
  INotification,
  INotificationParams,
} from "@/domain/interfaces/INotification";
import toast from "react-hot-toast";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";
import { socketService } from "@/services/socket";

interface NotificationState {
  // State
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: IApiError | null;

  // Actions
  fetchNotifications: (params?: INotificationParams) => Promise<void>;
  createNotification: (notification: INotification) => Promise<void>; // 👈 THÊM MỚI
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;

  // Real-time actions
  addNotification: (notification: INotification) => void;
  updateNotification: (
    notificationId: string,
    updates: Partial<INotification>
  ) => void;
  removeNotification: (notificationId: string) => void;

  // Helpers
  clearNotifications: () => void;
  clearError: () => void;

  // Socket listeners
  setupRealtimeListeners: () => void;
  cleanupRealtimeListeners: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  // Initial State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  /**
   * Fetch notifications
   */
  fetchNotifications: async (params?: INotificationParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await NotificationAPI.getNotifications(params);

      set({
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  /**
   * Create new notification
   */
  createNotification: async (notification: INotification) => {
    try {
      set({ isLoading: true, error: null });

      await NotificationAPI.addNotification(notification);

      set({ isLoading: false });

      toast.success("Gửi thông báo thành công!");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error("Gửi thông báo thất bại!");
      throw error;
    }
  },

  /**
   * Mark as read
   */
  markAsRead: async (notificationId: string) => {
    try {
      await NotificationAPI.markAsRead(notificationId);

      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    try {
      await NotificationAPI.markAllAsRead();

      // Update all to read
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          is_read: true,
        })),
        unreadCount: 0,
      }));

      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string) => {
    try {
      const notification = get().notifications.find(
        (n) => n.id === notificationId
      );

      await NotificationAPI.deleteNotification(notificationId);

      // Remove from list
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
        unreadCount:
          notification && !notification.is_read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      }));

      toast.success("Đã xóa thông báo");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  /**
   * Delete all read notifications
   */
  deleteAllRead: async () => {
    try {
      await NotificationAPI.deleteAllRead();

      // Remove all read notifications
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.is_read),
      }));

      toast.success("Đã xóa tất cả thông báo đã đọc");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },

  /**
   * Real-time: Add notification
   */
  addNotification: (notification: INotification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Show toast
    // toast.success(notification.title, {
    //   description: notification.content,
    //   duration: 5000,
    // });
  },

  /**
   * Real-time: Update notification
   */
  updateNotification: (
    notificationId: string,
    updates: Partial<INotification>
  ) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, ...updates } : notif
      ),
    }));
  },

  /**
   * Real-time: Remove notification
   */
  removeNotification: (notificationId: string) => {
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
        unreadCount:
          notification && !notification.is_read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    });
  },

  /**
   * Clear notifications
   */
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0, error: null });
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Setup real-time listeners
   */
  setupRealtimeListeners: () => {
    // Listen for new notification
    socketService.on(
      "notification:new",
      (data: { notification: INotification }) => {
        console.log("🔔 New notification:", data);
        get().addNotification(data.notification);
      }
    );

    // Listen for notification read
    socketService.on(
      "notification:read",
      (data: { notificationId: string }) => {
        get().updateNotification(data.notificationId, { is_read: true });
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    );

    // Listen for all read
    socketService.on("notification:all-read", () => {
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    });

    // Listen for notification deleted
    socketService.on(
      "notification:deleted",
      (data: { notificationId: string }) => {
        get().removeNotification(data.notificationId);
      }
    );
  },

  /**
   * Cleanup listeners
   */
  cleanupRealtimeListeners: () => {
    socketService.off("notification:new");
    socketService.off("notification:read");
    socketService.off("notification:all-read");
    socketService.off("notification:deleted");
  },
}));
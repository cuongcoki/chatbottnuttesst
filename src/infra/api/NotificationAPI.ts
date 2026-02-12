import axiosInstance from "./conflig/axiosInstance";
import { API_ENDPOINTS } from "./conflig/apiEndpoints";
import { 
  INotificationResponse, 
  INotificationParams, 
  INotification
} from "@/domain/interfaces/INotification";

class NotificationAPI {
  /**
   * Thêm notification
   */
  async addNotification(notification: INotification): Promise<INotification> {
    const response = await axiosInstance.post<INotification>(
      API_ENDPOINTS.NOTIFICATIONS.CREATE,
      notification
    );
    return response.data;
  }


  /**
   * Lấy danh sách notifications
   */
  async getNotifications(params?: INotificationParams): Promise<INotificationResponse> {
    const response = await axiosInstance.get<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Đánh dấu notification đã đọc
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
    );
    return response.data;
  }

  /**
   * Đánh dấu tất cả đã đọc
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.put(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  }

  /**
   * Xóa notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)
    );
    return response.data;
  }

  /**
   * Xóa tất cả notifications đã đọc
   */
  async deleteAllRead(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL_READ
    );
    return response.data;
  }
}

export default new NotificationAPI();
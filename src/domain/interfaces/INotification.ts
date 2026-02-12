export interface INotification {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'assignment' | 'quiz' | 'grade' | 'announcement';
  is_read: boolean;
  link?: string;
  created_at: string;
  updated_at: string;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: INotification[];
    unreadCount: number;
    total: number;
    page: number;
    limit: number;
  };
}

export interface INotificationParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
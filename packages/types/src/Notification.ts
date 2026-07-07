export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory =
  | 'purchase'
  | 'session'
  | 'assignment'
  | 'chat'
  | 'badge'
  | 'certificate'
  | 'refund'
  | 'payment';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

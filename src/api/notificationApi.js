import { APIService } from '@/api/api';

/* /api/v1/notifications 알림 목록 조회 */
export const getNotifications = ({ userNumber, cursor = 1, size = 10 }) =>
  APIService.public.get('/notifications', {
    params: { userNumber, cursor, size },
  });

/* /api/v1/notifications/polling 신규 알림 조회 */
export const pollNotifications = (userNumber) =>
  APIService.public.get('/notifications/polling', {
    params: { userNumber },
  });

export const hasUnreadNotifications = (payload) => {
  const data = payload?.data ?? payload ?? {};
  if (typeof data === 'number') return data > 0;
  if (typeof data === 'boolean') return data;
  if (Array.isArray(data)) return data.length > 0;

  const count =
    data.newNotificationCount ??
    data.unreadCount ??
    data.unReadCount ??
    data.count ??
    data.notificationCount;
  if (typeof count === 'number') return count > 0;
  if (data.hasNewNotification === true || data.hasUnread === true) return true;
  if (Array.isArray(data.content)) return data.content.length > 0;
  if (Array.isArray(data.notifications)) return data.notifications.length > 0;
  return false;
};

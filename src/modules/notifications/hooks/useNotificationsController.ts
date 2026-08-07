import { useState, useCallback, useEffect } from 'react';
import { NotificationItem } from '../dto/notification.dto';
import { NotificationRepository } from '../repositories/notification.repository';

export function useNotificationsController(initialSkip = 0, initialTake = 20) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [skip, setSkip] = useState<number>(initialSkip);
  const [take, setTake] = useState<number>(initialTake);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (currentSkip = skip, currentTake = take) => {
    setLoading(true);
    setError(null);
    try {
      const res = await NotificationRepository.getNotifications(currentSkip, currentTake);
      if (res?.data) {
        setNotifications(res.data.items || []);
        setTotal(res.data.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err?.message || 'Failed to fetch notifications data');
    } finally {
      setLoading(false);
    }
  }, [skip, take]);

  useEffect(() => {
    fetchNotifications(skip, take);
  }, [skip, take, fetchNotifications]);

  return {
    notifications,
    total,
    skip,
    setSkip,
    take,
    setTake,
    loading,
    error,
    fetchNotifications,
  };
}

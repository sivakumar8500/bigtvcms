import { useState, useCallback, useEffect } from 'react';
import { NotificationItem, NotificationLanguage } from '../dto/notification.dto';
import { NotificationRepository } from '../repositories/notification.repository';

export function useNotificationsController(
  initialSkip = 0,
  initialTake = 20,
  initialLanguage: NotificationLanguage = 'te'
) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [skip, setSkip] = useState<number>(initialSkip);
  const [take, setTake] = useState<number>(initialTake);
  const [selectedLanguage, setSelectedLanguage] = useState<NotificationLanguage>(initialLanguage);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (
      currentSkip = skip,
      currentTake = take,
      currentLang = selectedLanguage,
      search?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await NotificationRepository.getNotifications(
          currentSkip,
          currentTake,
          currentLang,
          search
        );
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
    },
    [skip, take, selectedLanguage]
  );

  useEffect(() => {
    fetchNotifications(skip, take, selectedLanguage);
  }, [skip, take, selectedLanguage, fetchNotifications]);

  const handleLanguageChange = (lang: NotificationLanguage) => {
    setSelectedLanguage(lang);
    setSkip(0);
  };

  return {
    notifications,
    total,
    skip,
    setSkip,
    take,
    setTake,
    selectedLanguage,
    setSelectedLanguage,
    handleLanguageChange,
    loading,
    error,
    fetchNotifications,
  };
}

import { useState, useEffect } from 'react';
import { supabase, subscribeToUserNotifications } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          issues(title, id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
      setLoading(false);
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const subscription = subscribeToUserNotifications(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(payload.new.title, {
            body: payload.new.message,
            icon: '/favicon.ico'
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission
  };
};
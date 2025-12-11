import { useEffect, useRef, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notifications';

interface NotificationData {
  type?: string;
  screen?: string;
  id?: string | number;
  [key: string]: unknown;
}

export function useNotifications() {
  const { memberId, isLoggedIn } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const tokenSentRef = useRef<boolean>(false);

  const registerAndSendToken = useCallback(async () => {
    if (!isLoggedIn || !memberId) {
      tokenSentRef.current = false;
      return;
    }

    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setExpoPushToken(token);
        if (!tokenSentRef.current) {
          await notificationService.sendTokenToServer(memberId);
          tokenSentRef.current = true;
          console.log('Push token sent to server successfully');
        }
      }
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }, [isLoggedIn, memberId]);

  useEffect(() => {
    if (isLoggedIn && memberId) {
      registerAndSendToken();
    } else {
      tokenSentRef.current = false;
      setExpoPushToken(null);
    }
  }, [isLoggedIn, memberId, registerAndSendToken]);

  useEffect(() => {
    notificationListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = notificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data as NotificationData;
        console.log('Notification response:', data);
        handleNotificationNavigation(data);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleNotificationNavigation = (data: NotificationData) => {
    if (data.type === 'subscription_expiring' || data.screen === 'Subscriptions') {
    } else if (data.type === 'payment_reminder' || data.screen === 'Payments') {
    } else if (data.type === 'new_offer' || data.screen === 'Offers') {
    }
  };

  return {
    expoPushToken,
    notification,
    scheduleLocalNotification: notificationService.scheduleLocalNotification.bind(notificationService),
  };
}

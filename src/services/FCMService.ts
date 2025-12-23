import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import { updateFCMToken } from './api';
import { handleNotification } from '../utils/notificationHandler';

class FCMService {
  async initialize() {
    await this.requestPermission();
    await this.createChannel();
    await this.getFCMToken();
    this.setupHandlers();
  }

  async requestPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    await messaging().requestPermission();
  }

  async createChannel() {
    await notifee.createChannel({
      id: 'default_channel',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcm_token', token);
        await this.sendTokenToServer(token);
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
    
    messaging().onTokenRefresh(async (newToken) => {
      await AsyncStorage.setItem('fcm_token', newToken);
      await this.sendTokenToServer(newToken);
    });
  }

  async sendTokenToServer(token: string) {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (authToken) {
        await updateFCMToken(token);
        console.log('FCM token sent to server');
      }
    } catch (error) {
      console.error('Error sending FCM token:', error);
    }
  }

  setupHandlers() {
    // Foreground notifications
    messaging().onMessage(async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        android: {
          channelId: 'default_channel',
          importance: AndroidImportance.HIGH,
        },
      });
    });

    // Background notifications
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
    });

    // Notification tap when app is in background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotification(remoteMessage);
    });

    // App opened from quit state via notification
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        handleNotification(remoteMessage);
      }
    });

    // Notifee foreground event handler
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotification({ data: detail.notification?.data });
      }
    });
  }

  async deleteToken() {
    try {
      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcm_token');
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }
}

export default new FCMService();

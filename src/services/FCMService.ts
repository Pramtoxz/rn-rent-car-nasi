import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  onTokenRefresh, 
  onMessage, 
  setBackgroundMessageHandler, 
  onNotificationOpenedApp, 
  getInitialNotification, 
  deleteToken 
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import { updateFCMToken } from './api';
import { handleNotification } from '../utils/notificationHandler';

class FCMService {
  private messaging = getMessaging();
  private messageListeners: ((message: any) => void)[] = [];

  addMessageListener(listener: (message: any) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

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
    await requestPermission(this.messaging);
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
      const token = await getToken(this.messaging);
      if (token) {
        await AsyncStorage.setItem('fcm_token', token);
        await this.sendTokenToServer(token);
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
    
    onTokenRefresh(this.messaging, async (newToken) => {
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
    onMessage(this.messaging, async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      
      // Notify custom listeners
      this.messageListeners.forEach(listener => listener(remoteMessage));

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
    setBackgroundMessageHandler(this.messaging, async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
    });

    // Notification tap when app is in background
    onNotificationOpenedApp(this.messaging, (remoteMessage) => {
      handleNotification(remoteMessage);
    });

    // App opened from quit state via notification
    getInitialNotification(this.messaging).then((remoteMessage) => {
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
      await deleteToken(this.messaging);
      await AsyncStorage.removeItem('fcm_token');
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }
}

export default new FCMService();

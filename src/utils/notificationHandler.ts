import { Alert } from 'react-native';
import { navigate } from '../navigation/navigationRef';

interface NotificationData {
  type?: string;
  booking_id?: string;
  status?: string;
  catatan?: string;
}

interface RemoteMessage {
  data?: NotificationData;
}

export const handleNotification = (remoteMessage: RemoteMessage) => {
  if (!remoteMessage?.data) return;

  const { type, booking_id, status, catatan } = remoteMessage.data;

  switch (type) {
    case 'user_verification':
      Alert.alert(
        status === 'verified' ? '✅ Verifikasi Berhasil' : '❌ Verifikasi Ditolak',
        status === 'verified' 
          ? 'Akun Anda telah diverifikasi!' 
          : catatan || 'Verifikasi ditolak',
        [{ text: 'OK', onPress: () => navigate('Home') }]
      );
      break;

    case 'payment_verification':
      Alert.alert(
        status === 'verified' ? 'Pembayaran Diverifikasi' : 'Pembayaran Ditolak',
        status === 'verified'
          ? 'Pembayaran telah diverifikasi'
          : catatan || 'Pembayaran ditolak',
        [{ 
          text: 'Lihat Detail', 
          onPress: () => navigate('BookingDetail', { id: booking_id }) 
        }]
      );
      break;

    case 'booking_status':
      if (booking_id) {
        navigate('BookingDetail', { id: booking_id });
      }
      break;

    case 'broadcast':
      break;

    default:
      console.log('Unknown notification type:', type);
  }
};

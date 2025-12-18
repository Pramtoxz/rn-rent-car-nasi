import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

export const showAlert = {
  success: (message: string, title: string = 'Berhasil') => {
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title,
      textBody: message,
      autoClose: 3000,
    });
  },

  error: (message: string, title: string = 'Error') => {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title,
      textBody: message,
      autoClose: 3000,
    });
  },

  warning: (message: string, title: string = 'Peringatan') => {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title,
      textBody: message,
      autoClose: 3000,
    });
  },

  info: (message: string, title: string = 'Info') => {
    Toast.show({
      type: ALERT_TYPE.INFO,
      title,
      textBody: message,
      autoClose: 3000,
    });
  },
};

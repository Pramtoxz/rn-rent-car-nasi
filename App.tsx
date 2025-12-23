import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import AppNavigator from './src/navigation/AppNavigator';
import FCMService from './src/services/FCMService';

const App = () => {
  useEffect(() => {
    FCMService.initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <AppNavigator />
      </AlertNotificationRoot>
    </SafeAreaProvider>
  );
};

export default App;

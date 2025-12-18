import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <AppNavigator />
      </AlertNotificationRoot>
    </SafeAreaProvider>
  );
};

export default App;
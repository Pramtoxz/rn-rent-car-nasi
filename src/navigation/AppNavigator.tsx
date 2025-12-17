import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import CarDetailsScreen from '../screens/CarDetailsScreen';
import MapTrackingScreen from '../screens/MapTrackingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
        <Stack.Screen name="MapTracking" component={MapTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

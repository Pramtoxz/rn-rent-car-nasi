import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface LoadingLottieProps {
  size?: number;
}

const LoadingLottie: React.FC<LoadingLottieProps> = ({ size = 150 }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/loading.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingLottie;

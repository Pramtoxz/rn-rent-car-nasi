import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import {colors} from '../theme/colors';
interface LoadingLottieProps {
  size?: number;
}

const LoadingLottie: React.FC<LoadingLottieProps> = ({ size = 250 }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/loading.json')}
        autoPlay
        loop
        style={styles.loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading:{
    width: 250,
    height: 250,
  }
});

export default LoadingLottie;

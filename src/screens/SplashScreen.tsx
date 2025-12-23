import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/splash.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    <Text style={styles.textSplash}>Rent Car Nasi</Text>
    <Text style={styles.textBody}>Tugas Akhir Mobile 2</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  textSplash:{
      fontFamily: fonts.bold,
        fontSize: 24,
        color: colors.background,
  },
    textBody:{
      fontFamily: fonts.light,
        fontSize: 18,
        color: colors.background,
  }
});

export default SplashScreen;

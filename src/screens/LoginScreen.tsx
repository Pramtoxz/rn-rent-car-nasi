import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { authService } from '../services/authService';
import { showAlert } from '../utils/alert';
import LoadingLottie from '../components/LoadingLottie';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [nohp, setNohp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRequestOTP = async () => {
    if (!nohp || nohp.length < 10) {
      showAlert.error('Masukkan nomor whatsapp yang valid');
      return;
    }

    setLoading(true);
    try {
      // Format nomor dengan prefix 62
      const formattedPhone = nohp.startsWith('0') ? '62' + nohp.substring(1) : '62' + nohp;
      const response = await authService.requestOTP(formattedPhone);
      showAlert.success(response.message);
      navigation.navigate('VerifyOTP', { nohp: formattedPhone });
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.animationContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LottieView
            source={require('../assets/lottie/skate.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Rent Car Nasi</Text>
            <Text style={styles.subtitle}>
              Masukkan nomor whatsapp untuk masuk
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <View style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefixText}>+62</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="812 3456 7890"
                placeholderTextColor={colors.secondary}
                value={nohp}
                onChangeText={setNohp}
                keyboardType="phone-pad"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
            <Text style={styles.helperText}>
              Kami akan mengirimkan kode verifikasi ke nomor ini
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRequestOTP}
            disabled={loading}
            activeOpacity={0.8}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {loading ? 'Mengirim...' : 'Kirim OTP'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.securityBadge}>
            <Text style={styles.securityText}>Tugas Akhir Mobile 2</Text>
          </View>
        </Animated.View>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <LoadingLottie />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  animationContainer: {
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  animation: {
    width: width * 0.8,
    height: width * 0.6,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.white,
    marginBottom: 12,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.light,
    fontSize: 14,
    color: colors.white,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  prefixContainer: {
    paddingLeft: 20,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.secondary + '30',
  },
  prefixText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  input: {
    flex: 1,
    padding: 20,
    fontFamily: fonts.book,
    fontSize: 18,
    color: colors.white,
  },
  helperText: {
    fontFamily: fonts.book,
    fontSize: 13,
    color: colors.secondary,
    marginTop: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.background,
  },
  buttonIcon: {
    fontSize: 24,
    color: colors.background,
    fontWeight: 'bold',
  },
  securityBadge: {
    alignItems: 'center',
    marginTop: 24,
  },
  securityText: {
    fontFamily: fonts.book,
    fontSize: 13,
    color: colors.secondary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default LoginScreen;

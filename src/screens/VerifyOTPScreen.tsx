import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import LoadingLottie from '../components/LoadingLottie';

const { width } = Dimensions.get('window');

const VerifyOTPScreen = ({ route, navigation }: any) => {
  const { nohp } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const boxAnimations = useRef(
    Array(6).fill(0).map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Animate box
    Animated.sequence([
      Animated.timing(boxAnimations[index], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(boxAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when complete
    if (index === 5 && value) {
      const otpCode = [...newOtp.slice(0, 5), value].join('');
      if (otpCode.length === 6) {
        handleVerifyOTP(otpCode);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      showAlert.error('Masukkan kode OTP 6 digit');
      return;
    }

    setLoading(true);
    try {
      const response = await login(nohp, code);
      showAlert.success('OTP berhasil diverifikasi');
      
      if (response.data.needs_profile) {
        navigation.replace('CompleteProfile');
      }
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Kode OTP tidak valid');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    showAlert.success('Kode OTP telah dikirim ulang');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.iconContainer}>
          <Image
          source={require('../assets/images/icon/whatsapp.png')} style={styles.LogoWA}></Image>
          </View>
          <Text style={styles.title}>OTP WhatsApp Terkirim</Text>
          <Text style={styles.subtitle}>
            Kami telah mengirimkan kode 6 digit ke
          </Text>
          <Text style={styles.phoneNumber}>+62 {nohp}</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.otpContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {otp.map((digit, index) => (
            <Animated.View
              key={index}
              style={[
                styles.otpBoxWrapper,
                { transform: [{ scale: boxAnimations[index] }] }
              ]}
            >
              <View style={[
                styles.otpBox,
                digit && styles.otpBoxFilled
              ]}>
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => handleVerifyOTP()}
            disabled={loading}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {loading ? 'Memverifikasi...' : 'Verifikasi Sekarang'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Tidak menerima kode? </Text>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendLink}>Kirim Ulang</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.book,
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  LogoWA:{
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    resizeMode: 'stretch'
  },
  otpBoxWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpBox: {
    aspectRatio: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.secondary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground,
    borderWidth: 3,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
    includeFontPadding: false,
    padding: 0,
  },
  actionContainer: {
    flex: 1,
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
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.background,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: fonts.book,
    fontSize: 15,
    color: colors.secondary,
  },
  resendLink: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default VerifyOTPScreen;

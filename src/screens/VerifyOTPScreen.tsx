import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';

const VerifyOTPScreen = ({ route, navigation }: any) => {
  const { nohp } = route.params;
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Masukkan kode OTP 6 digit');
      return;
    }

    setLoading(true);
    try {
      const response = await login(nohp, otpCode);
      
      if (response.data.needs_profile) {
        navigation.replace('CompleteProfile');
      }
      // No need to navigate, AuthContext will handle the navigation
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Kode OTP tidak valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verifikasi OTP</Text>
        <Text style={styles.subtitle}>
          Masukkan kode OTP yang dikirim ke {nohp}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kode OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor={colors.secondary}
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Memverifikasi...' : 'Verifikasi'}
          </Text>
        </TouchableOpacity>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.book,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontFamily: fonts.book,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
});

export default VerifyOTPScreen;

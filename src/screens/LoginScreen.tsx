import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { authService } from '../services/authService';
import { showAlert } from '../utils/alert';
import LoadingLottie from '../components/LoadingLottie';

const LoginScreen = ({ navigation }: any) => {
  const [nohp, setNohp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!nohp || nohp.length < 10) {
      showAlert.error('Masukkan nomor HP yang valid');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestOTP(nohp);
      showAlert.success(response.message);
      navigation.navigate('VerifyOTP', { nohp });
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Masukkan nomor HP untuk login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nomor HP</Text>
          <TextInput
            style={styles.input}
            placeholder="628123456789"
            placeholderTextColor={colors.secondary}
            value={nohp}
            onChangeText={setNohp}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRequestOTP}
          disabled={loading}>
          <Text style={styles.buttonText}>
            Kirim OTP
          </Text>
        </TouchableOpacity>
        
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
    fontSize: 16,
    color: colors.white,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default LoginScreen;

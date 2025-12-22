import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import LoadingLottie from '../components/LoadingLottie';

const CompleteProfileScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [fotoKTP, setFotoKTP] = useState<any>(null);
  const [fotoSelfie, setFotoSelfie] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const pickImage = async (type: 'ktp' | 'selfie') => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      if (type === 'ktp') {
        setFotoKTP(result.assets[0]);
      } else {
        setFotoSelfie(result.assets[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !nik || !alamat || !fotoKTP || !fotoSelfie) {
      showAlert.error('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        name,
        email,
        nik,
        alamat,
        foto_ktp: {
          uri: fotoKTP.uri,
          type: fotoKTP.type || 'image/jpeg',
          name: fotoKTP.fileName || `ktp_${Date.now()}.jpg`,
        },
        foto_selfie: {
          uri: fotoSelfie.uri,
          type: fotoSelfie.type || 'image/jpeg',
          name: fotoSelfie.fileName || `selfie_${Date.now()}.jpg`,
        },
      };

      await authService.completeProfile(data);
      await refreshUser();
      showAlert.success('Profil berhasil dilengkapi, menunggu verifikasi admin');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Gagal melengkapi profil';
      showAlert.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Lengkapi Profil</Text>
        <Text style={styles.subtitle}>Isi data diri untuk melanjutkan</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={colors.secondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>NIK</Text>
          <TextInput
            style={styles.input}
            placeholder="1234567890123456"
            placeholderTextColor={colors.secondary}
            value={nik}
            onChangeText={setNik}
            keyboardType="number-pad"
            maxLength={16}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Jl. Example No. 123"
            placeholderTextColor={colors.secondary}
            value={alamat}
            onChangeText={setAlamat}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Foto KTP</Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('ktp')}>
            {fotoKTP ? (
              <Image source={{ uri: fotoKTP.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="camera" size={24} color={colors.secondary} />
                <Text style={styles.imageButtonText}>Pilih Foto KTP</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Foto Selfie dengan KTP</Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('selfie')}>
            {fotoSelfie ? (
              <Image source={{ uri: fotoSelfie.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="camera" size={24} color={colors.secondary} />
                <Text style={styles.imageButtonText}>Pilih Foto Selfie</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            Simpan
          </Text>
        </TouchableOpacity>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <LoadingLottie />
          </View>
        )}
      </ScrollView>
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
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.white,
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontFamily: fonts.book,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
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

export default CompleteProfileScreen;

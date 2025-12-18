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

const EditProfileScreen = ({ navigation }: any) => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [nik, setNik] = useState(user?.nik || '');
  const [alamat, setAlamat] = useState(user?.alamat || '');
  const [fotoKTP, setFotoKTP] = useState<any>(null);
  const [fotoSelfie, setFotoSelfie] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    if (!name || !email || !nik || !alamat) {
      showAlert.error('Semua field harus diisi');
      return;
    }

    // Jika status rejected, wajib upload ulang foto
    if (user?.status_verifikasi === 'rejected' && (!fotoKTP || !fotoSelfie)) {
      showAlert.error('Untuk akun yang ditolak, wajib upload ulang foto KTP dan Selfie');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        name,
        email,
        nik,
        alamat,
      };
      
      // Upload foto baru jika ada
      if (fotoKTP) {
        data.foto_ktp = {
          uri: fotoKTP.uri,
          type: fotoKTP.type || 'image/jpeg',
          name: fotoKTP.fileName || `ktp_${Date.now()}.jpg`,
        };
      }
      
      if (fotoSelfie) {
        data.foto_selfie = {
          uri: fotoSelfie.uri,
          type: fotoSelfie.type || 'image/jpeg',
          name: fotoSelfie.fileName || `selfie_${Date.now()}.jpg`,
        };
      }

      await authService.updateProfile(data);
      await refreshUser();
      showAlert.success('Profil berhasil diperbarui, menunggu verifikasi admin');
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Gagal memperbarui profil';
      showAlert.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user?.status_verifikasi === 'rejected' && (
          <View style={styles.rejectedBanner}>
            <Icon name="alert-triangle" size={24} color="#F44336" />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Akun Ditolak</Text>
              <Text style={styles.bannerText}>
                Perbaiki data Anda dan upload ulang foto KTP & Selfie untuk verifikasi ulang
              </Text>
            </View>
          </View>
        )}

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
          <Text style={styles.label}>
            Foto KTP {user?.status_verifikasi === 'rejected' && <Text style={styles.required}>*</Text>}
          </Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('ktp')}>
            {fotoKTP ? (
              <Image source={{ uri: fotoKTP.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="camera" size={24} color={colors.secondary} />
                <Text style={styles.imageButtonText}>
                  {user?.status_verifikasi === 'rejected' ? 'Upload Ulang Foto KTP' : 'Ganti Foto KTP (Opsional)'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Foto Selfie dengan KTP {user?.status_verifikasi === 'rejected' && <Text style={styles.required}>*</Text>}
          </Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage('selfie')}>
            {fotoSelfie ? (
              <Image source={{ uri: fotoSelfie.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="camera" size={24} color={colors.secondary} />
                <Text style={styles.imageButtonText}>
                  {user?.status_verifikasi === 'rejected' ? 'Upload Ulang Foto Selfie' : 'Ganti Foto Selfie (Opsional)'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  rejectedBanner: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  bannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#F44336',
    marginBottom: 4,
  },
  bannerText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 18,
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
  required: {
    color: '#F44336',
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
    textAlign: 'center',
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
});

export default EditProfileScreen;

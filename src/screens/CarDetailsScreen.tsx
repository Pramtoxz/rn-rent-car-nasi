import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { mobilService, Mobil } from '../services/mobilService';
import { useFocusEffect } from '@react-navigation/native';
import LoadingLottie from '../components/LoadingLottie';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';

const CarDetailsScreen = ({ route, navigation }: any) => {
  const { carId } = route.params;
  const [mobil, setMobil] = useState<Mobil | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      loadMobilDetail();
    }, [carId])
  );

  const loadMobilDetail = async () => {
    setLoading(true);
    try {
      const data = await mobilService.getMobilDetail(carId);
      setMobil(data);
    } catch (error) {
      showAlert.error('Gagal memuat detail mobil');
      navigation.goBack();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleBookCar = () => {
    if (user?.status_verifikasi !== 'verified') {
      let message = 'Akun Anda belum diverifikasi';
      if (user?.status_verifikasi === 'pending') {
        message = 'Akun Anda masih menunggu verifikasi admin';
      } else if (user?.status_verifikasi === 'rejected') {
        message = 'Akun Anda ditolak oleh admin';
      }
      showAlert.warning(message, 'Tidak Dapat Booking');
      return;
    }

    if (mobil?.status !== 'tersedia') {
      showAlert.warning('Mobil ini sedang tidak tersedia', 'Tidak Tersedia');
      return;
    }

    navigation.navigate('Booking', { mobil });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLottie />
      </View>
    );
  }

  if (!mobil) {
    return null;
  }

  const isBookingDisabled = user?.status_verifikasi !== 'verified' || mobil.status !== 'tersedia';
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Mobil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: mobil.foto_mobil }}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mobil.jenis_transmisi}</Text>
            </View>
            <View style={[styles.badge, mobil.status === 'tersedia' ? styles.badgeAvailable : styles.badgeUnavailable]}>
              <Text style={styles.badgeText}>{mobil.status}</Text>
            </View>
            <View style={styles.logoContainer}>
              <Icon name="shield" size={24} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.carName}>{mobil.nama_mobil} ({mobil.tahun})</Text>
          <Text style={styles.carPrice}>{mobil.harga_formatted}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Merk</Text>
              <Text style={styles.detailValue}>{mobil.merk}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plat Nomor</Text>
              <Text style={styles.detailValue}>{mobil.plat_nomor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Warna</Text>
              <Text style={styles.detailValue}>{mobil.warna}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transmisi</Text>
              <Text style={styles.detailValue}>{mobil.jenis_transmisi}</Text>
            </View>
          </View>

          <Text style={styles.descriptionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>{mobil.deskripsi}</Text>

          <View style={styles.specsContainer}>
            <View style={styles.specCard}>
              <Icon name="users" size={32} color={colors.secondary} />
              <Text style={styles.specLabel}>Kapasitas</Text>
              <Text style={styles.specValue}>{mobil.kapasitas_penumpang} Seats</Text>
            </View>
            <View style={styles.specCard}>
              <Icon name="calendar" size={32} color={colors.secondary} />
              <Text style={styles.specLabel}>Tahun</Text>
              <Text style={styles.specValue}>{mobil.tahun}</Text>
            </View>
            <View style={styles.specCard}>
              <Icon name="settings" size={32} color={colors.secondary} />
              <Text style={styles.specLabel}>Transmisi</Text>
              <Text style={styles.specValue}>{mobil.jenis_transmisi}</Text>
            </View>
          </View>

          {user?.status_verifikasi !== 'verified' && (
            <View style={styles.warningContainer}>
              <Icon name="alert-circle" size={20} color={colors.primary} />
              <Text style={styles.warningText}>
                {user?.status_verifikasi === 'pending' 
                  ? 'Akun Anda masih menunggu verifikasi admin'
                  : user?.status_verifikasi === 'rejected'
                  ? 'Akun Anda ditolak oleh admin'
                  : 'Akun Anda belum diverifikasi'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bookButton, isBookingDisabled && styles.bookButtonDisabled]}
          onPress={handleBookCar}
          disabled={isBookingDisabled}>
          <Icon 
            name={isBookingDisabled ? 'lock' : 'check-circle'} 
            size={20} 
            color={isBookingDisabled ? colors.secondary : colors.background} 
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.bookButtonText, isBookingDisabled && styles.bookButtonTextDisabled]}>
            {isBookingDisabled ? 'Tidak Dapat Booking' : 'Book Car'}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.primary,
  },
  badgeAvailable: {
    borderColor: '#4CAF50',
  },
  badgeUnavailable: {
    borderColor: colors.secondary,
  },
  logoContainer: {
    marginLeft: 'auto',
  },
  carName: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: 8,
  },
  carPrice: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
    marginBottom: 24,
  },
  specsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  specCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    marginTop: 8,
  },
  specValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.cardBackground,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  bookButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
  bookButtonTextDisabled: {
    color: colors.secondary,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  detailLabel: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  detailValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  descriptionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.primary,
  },
});

export default CarDetailsScreen;

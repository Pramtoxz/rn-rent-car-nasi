import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { bookingService, Booking } from '../services/bookingService';
import { showAlert } from '../utils/alert';

const BookingDetailScreen = ({ navigation, route }: any) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBookingDetail();
  }, []);

  const loadBookingDetail = async () => {
    try {
      const response = await bookingService.getBookingDetail(bookingId);
      setBooking(response.data);
    } catch (error) {
      showAlert.error('Gagal memuat detail booking');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBukti = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      const image = result.assets[0];
      setUploading(true);

      try {
        console.log('=== UPLOAD BUKTI ===');
        console.log('Image URI:', image.uri);
        console.log('Image Type:', image.type);
        console.log('Image Name:', image.fileName);
        console.log('Booking ID:', bookingId);

        const formData = new FormData();
        
        // Prepare file object
        const fileUri = image.uri;
        const fileType = image.type || 'image/jpeg';
        const fileName = image.fileName || `bukti_${Date.now()}.jpg`;

        // For Android, remove 'file://' prefix if exists
        const uri = fileUri?.startsWith('file://') ? fileUri : `file://${fileUri}`;

        formData.append('bukti_bayar', {
          uri: uri,
          type: fileType,
          name: fileName,
        } as any);

        console.log('FormData prepared with URI:', uri);
        const response = await bookingService.uploadBuktiBayar(bookingId, formData);
        console.log('Upload response:', response);

        showAlert.success('Bukti pembayaran berhasil diupload, menunggu verifikasi admin');
        setTimeout(() => {
          loadBookingDetail();
        }, 1000);
      } catch (error: any) {
        console.log('=== UPLOAD ERROR ===');
        console.log('Error:', error);
        console.log('Error message:', error.message);
        console.log('Error response:', error.response?.data);
        console.log('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Gagal upload bukti pembayaran';
        showAlert.error(errorMessage);
      } finally {
        setUploading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return colors.primary;
      case 'cancelled':
        return '#F44336';
      default:
        return colors.secondary;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: any = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      checked_in: 'Sedang Berjalan',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Kode Booking */}
          <View style={styles.section}>
            <Text style={styles.kodeBooking}>{booking.kode_booking}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status_booking) }]}>
              <Text style={styles.statusText}>{getStatusText(booking.status_booking)}</Text>
            </View>
          </View>

          {/* Mobil Info */}
          <View style={styles.card}>
            <Image source={{ uri: booking.mobil.foto_mobil }} style={styles.carImage} resizeMode="contain" />
            <Text style={styles.carName}>{booking.mobil.nama_mobil}</Text>
            <Text style={styles.carMerk}>{booking.mobil.merk} • {booking.mobil.plat_nomor}</Text>
          </View>

          {/* Detail Rental */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detail Rental</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal Mulai</Text>
              <Text style={styles.detailValue}>{booking.tanggal_mulai}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal Selesai</Text>
              <Text style={styles.detailValue}>{booking.tanggal_selesai}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Durasi</Text>
              <Text style={styles.detailValue}>{booking.durasi_hari} Hari</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Harga per Hari</Text>
              <Text style={styles.detailValue}>Rp.{booking.harga_per_hari.toLocaleString('id-ID')}</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{booking.total_harga_formatted}</Text>
            </View>
          </View>

          {/* Catatan Customer */}
          {booking.catatan_customer && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Catatan Anda</Text>
              <Text style={styles.catatanText}>{booking.catatan_customer}</Text>
            </View>
          )}

          {/* Catatan Admin */}
          {booking.catatan_admin && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Catatan Admin</Text>
              <Text style={styles.catatanText}>{booking.catatan_admin}</Text>
            </View>
          )}

          {/* Bukti Pembayaran */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bukti Pembayaran</Text>
            <View style={styles.paymentStatus}>
              <Icon 
                name={booking.status_pembayaran === 'verified' ? 'check-circle' : 
                      booking.status_pembayaran === 'rejected' ? 'x-circle' : 'clock'} 
                size={20} 
                color={booking.status_pembayaran === 'verified' ? '#4CAF50' : 
                       booking.status_pembayaran === 'rejected' ? '#F44336' : colors.primary} 
              />
              <Text style={styles.paymentStatusText}>
                {booking.status_pembayaran === 'verified' ? 'Terverifikasi' :
                 booking.status_pembayaran === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi'}
              </Text>
            </View>

            {booking.bukti_bayar ? (
              <Image source={{ uri: booking.bukti_bayar }} style={styles.buktiBayar} resizeMode="contain" />
            ) : (
              <View style={styles.noBukti}>
                <Icon name="image" size={48} color={colors.secondary} />
                <Text style={styles.noBuktiText}>Belum ada bukti pembayaran</Text>
              </View>
            )}

            {booking.status_pembayaran === 'pending' && (
              <TouchableOpacity
                style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
                onPress={handleUploadBukti}
                disabled={uploading}>
                <Icon name="upload" size={20} color={colors.background} />
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Mengupload...' : booking.bukti_bayar ? 'Upload Ulang' : 'Upload Bukti'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
    padding: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  kodeBooking: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 12,
  },
  carImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
  },
  carName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 4,
  },
  carMerk: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  detailLabel: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  detailValue: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  catatanText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  paymentStatusText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  buktiBayar: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  noBukti: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noBuktiText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
    marginTop: 12,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
});

export default BookingDetailScreen;

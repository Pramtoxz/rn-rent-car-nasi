import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { bookingService } from '../services/bookingService';
import { showAlert } from '../utils/alert';

const BookingScreen = ({ navigation, route }: any) => {
  const { mobil } = route.params;
  const [tanggalMulai, setTanggalMulai] = useState(new Date());
  const [tanggalSelesai, setTanggalSelesai] = useState(new Date());
  const [showDatePickerMulai, setShowDatePickerMulai] = useState(false);
  const [showDatePickerSelesai, setShowDatePickerSelesai] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const calculateDuration = () => {
    const diff = Math.ceil((tanggalSelesai.getTime() - tanggalMulai.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calculateTotal = () => {
    const duration = calculateDuration();
    return duration * mobil.harga_sewa_per_hari;
  };

  const formatRupiah = (amount: number) => {
    return `Rp.${amount.toLocaleString('id-ID')}`;
  };

  const handleBooking = async () => {
    if (calculateDuration() <= 0) {
      showAlert.error('Tanggal selesai harus lebih besar dari tanggal mulai');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.createBooking({
        mobil_id: mobil.id,
        tanggal_mulai: formatDate(tanggalMulai),
        tanggal_selesai: formatDate(tanggalSelesai),
        catatan_customer: catatan,
      });

      showAlert.success('Booking berhasil! Silakan upload bukti pembayaran', 'Booking Berhasil');
      
      // Navigate to BookingDetail to upload payment proof
      setTimeout(() => {
        navigation.replace('BookingDetail', { bookingId: response.data.id });
      }, 1500);
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Gagal membuat booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Mobil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{mobil.nama_mobil}</Text>
          <Text style={styles.carPrice}>{mobil.harga_formatted}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tanggal Mulai</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePickerMulai(true)}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateText}>{formatDisplayDate(tanggalMulai)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tanggal Selesai</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePickerSelesai(true)}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateText}>{formatDisplayDate(tanggalSelesai)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tambahkan catatan untuk admin..."
            placeholderTextColor={colors.secondary}
            value={catatan}
            onChangeText={setCatatan}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Durasi</Text>
            <Text style={styles.summaryValue}>{calculateDuration()} Hari</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Harga per Hari</Text>
            <Text style={styles.summaryValue}>{formatRupiah(mobil.harga_sewa_per_hari)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(calculateTotal())}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={loading}>
          <Text style={styles.bookButtonText}>
            {loading ? 'Memproses...' : 'Konfirmasi Booking'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modals */}
      <DatePicker
        modal
        open={showDatePickerMulai}
        date={tanggalMulai}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setShowDatePickerMulai(false);
          setTanggalMulai(date);
          // Auto set tanggal selesai jika lebih kecil dari tanggal mulai
          if (date > tanggalSelesai) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setTanggalSelesai(nextDay);
          }
        }}
        onCancel={() => setShowDatePickerMulai(false)}
        title="Pilih Tanggal Mulai"
        confirmText="Pilih"
        cancelText="Batal"
      />

      <DatePicker
        modal
        open={showDatePickerSelesai}
        date={tanggalSelesai}
        mode="date"
        minimumDate={tanggalMulai}
        onConfirm={(date) => {
          setShowDatePickerSelesai(false);
          setTanggalSelesai(date);
        }}
        onCancel={() => setShowDatePickerSelesai(false)}
        title="Pilih Tanggal Selesai"
        confirmText="Pilih"
        cancelText="Batal"
      />
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
    paddingHorizontal: 20,
  },
  carInfo: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  carName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
    marginBottom: 8,
  },
  carPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  section: {
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
    fontSize: 14,
    color: colors.white,
  },
  dateButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summary: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  summaryValue: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
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
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.cardBackground,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
});

export default BookingScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { bookingService, Booking } from '../services/bookingService';

const BookingListScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.log('Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
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

  const getPembayaranStatusText = (status: string) => {
    const statusMap: any = {
      pending: 'Menunggu Pembayaran',
      verified: 'Terverifikasi',
      rejected: 'Ditolak',
    };
    return statusMap[status] || status;
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}>
      <View style={styles.cardHeader}>
        <Text style={styles.kodeBooking}>{item.kode_booking}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status_booking) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status_booking)}</Text>
        </View>
      </View>

      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.mobil.nama_mobil}</Text>
        <Text style={styles.carMerk}>{item.mobil.merk}</Text>
      </View>

      <View style={styles.dateInfo}>
        <View style={styles.dateRow}>
          <Icon name="calendar" size={16} color={colors.secondary} />
          <Text style={styles.dateText}>
            {item.tanggal_mulai} - {item.tanggal_selesai}
          </Text>
        </View>
        <Text style={styles.duration}>{item.durasi_hari} Hari</Text>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{item.total_harga_formatted}</Text>
        </View>
        <View style={styles.paymentStatus}>
          <Icon 
            name={item.status_pembayaran === 'verified' ? 'check-circle' : 'clock'} 
            size={16} 
            color={item.status_pembayaran === 'verified' ? '#4CAF50' : colors.primary} 
          />
          <Text style={styles.paymentText}>{getPembayaranStatusText(item.status_pembayaran)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Booking</Text>
          <View style={{ width: 40 }} />
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="inbox" size={64} color={colors.secondary} />
          <Text style={styles.emptyText}>Belum ada booking</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        />
      )}
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
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kodeBooking: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  carInfo: {
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
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  duration: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.book,
    fontSize: 16,
    color: colors.secondary,
    marginTop: 16,
  },
});

export default BookingListScreen;

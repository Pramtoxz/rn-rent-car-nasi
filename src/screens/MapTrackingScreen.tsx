import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import LoadingLottie from '../components/LoadingLottie';

const MapTrackingScreen = ({ navigation }: any) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingLottie />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pick-up Car</Text>
        <View style={styles.avatar} />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>Map View (react-native-maps)</Text>
        <View style={styles.markerPickup}>
          <Icon name="map-pin" size={24} color={colors.primary} />
        </View>
      </View>

      {/* Rent Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Rent Details</Text>
          <Text style={styles.totalPrice}>46705</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="map-pin" size={20} color={colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Pick-up Location</Text>
            <Text style={styles.detailValue}>Miramar, San Diego</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar" size={20} color={colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Pick-up Date</Text>
            <Text style={styles.detailValue}>Fri 11 Jun</Text>
          </View>
          <Icon name="clock" size={20} color={colors.primary} style={styles.timeIcon} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>09:45 PM</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar" size={20} color={colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Drop-off Date</Text>
            <Text style={styles.detailValue}>Mon 20 Jun</Text>
          </View>
          <Icon name="clock" size={20} color={colors.primary} style={styles.timeIcon} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>07:45 AM</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontFamily: fonts.book,
    fontSize: 16,
    color: colors.secondary,
  },
  markerPickup: {
    position: 'absolute',
    top: '30%',
    left: '30%',
  },
  detailsCard: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  totalPrice: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  timeIcon: {
    marginLeft: 12,
  },
  paymentButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paymentButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
});

export default MapTrackingScreen;

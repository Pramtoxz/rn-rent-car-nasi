import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const CarDetailsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Mobil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/car.png')}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SUV Car</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Off Road</Text>
          </View>
          <View style={styles.logoContainer}>
            <Icon name="shield" size={24} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.carName}>Lamborghini Urus (2022)</Text>
        <Text style={styles.carPrice}>Rp.500K/Day</Text>

        {/* Specs Grid */}
        <View style={styles.specsContainer}>
          <View style={styles.specCard}>
            <Icon name="users" size={32} color={colors.secondary} />
            <Text style={styles.specLabel}>Capacity</Text>
            <Text style={styles.specValue}>4 Seats</Text>
          </View>
          <View style={styles.specCard}>
            <Icon name="zap" size={32} color={colors.secondary} />
            <Text style={styles.specLabel}>Max Speed</Text>
            <Text style={styles.specValue}>680 KM/H</Text>
          </View>
          <View style={styles.specCard}>
            <Icon name="cpu" size={32} color={colors.secondary} />
            <Text style={styles.specLabel}>Engine Power</Text>
            <Text style={styles.specValue}>500 HP</Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('MapTracking')}>
          <Text style={styles.bookButtonText}>Book Car</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
});

export default CarDetailsScreen;

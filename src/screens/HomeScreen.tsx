import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const HomeScreen = ({ navigation }: any) => {
  const cars = [
    { id: 1, name: 'Lamborghini Urus', price: 'Rp.500K', image: require('../assets/images/car.png') },
    { id: 2, name: 'Becak Om Towel', price: 'Rp.350K', image: require('../assets/images/car.png') },
  ];

  const MENU_ITEMS = [
  { 
    id: 1, 
    name: 'Mobil', 
    image: require('../assets/images/menu-car.png') 
  },
  { 
    id: 2, 
    name: 'Riwayat', 
    image: require('../assets/images/menu-car.png') 
  },
  { 
    id: 3, 
    name: 'Tagihan', 
    image: require('../assets/images/menu-car.png')  },
  { 
    id: 4, 
    name: 'About',
    image: require('../assets/images/menu-car.png')  },
];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.whiteSection}>
          <View style={styles.header}>
            <View style={styles.locationContainer}>
              <Icon name="map-pin" size={20} color={colors.primary} />
              <View>
                <Text style={styles.locationLabel}>Lokasi</Text>
                <Text style={styles.locationText}>Padang, Sumatera Barat</Text>
              </View>
            </View>
            <View style={styles.avatar} />
          </View>

          <View style={styles.searchSection}>
            <Text style={styles.title}>Rent Car Nasi{'\n'}Tugas Akhir Mobile 2</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <Icon name="search" size={20} color={colors.secondary} />
                <TextInput
                  placeholder="Cari Mobil Impian Anda Dan Keluarga"
                  placeholderTextColor={colors.secondary}
                  style={styles.input}
                />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Icon name="sliders" size={20} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.darkSection}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu</Text>
          </View>
          <View style={styles.menusContainer}>
          {MENU_ITEMS.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuCard}>
                <Image 
                  source={item.image}
                  style={styles.menuImage}
                  resizeMode="contain"
                />
                <Text style={styles.namamenu}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rekomendasi */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rekomendasi</Text>
              <TouchableOpacity>
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cars.map(car => (
                <TouchableOpacity
                  key={car.id}
                  style={styles.carCard}
                  onPress={() => navigation.navigate('CarDetails')}>
                  <View style={styles.carImageContainer}>
                    <Image source={car.image} style={styles.carImage} resizeMode="contain" />
                  </View>
                  <Text style={styles.carName}>{car.name}</Text>
                  <Text style={styles.carPrice}>{car.price}/Day</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  whiteSection: {
    backgroundColor: colors.white,
    paddingBottom: 24,
  },
  darkSection: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationLabel: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
  },
  locationText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.cardBackground,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.background,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  moreText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.primary,
  },
  menusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    gap: 16,
  },
  menuCard: {
    width: 70,  
    height: 70,
    backgroundColor: colors.white,
    borderRadius: 18, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
   namamenu: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.background,
  },
  menuImage: {
    width: 36, 
    height: 36,
    // tintColor: colors.primary,
  },
  carCard: {
    width: 200,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginLeft: 20,
  },
  carImageContainer: {
    height: 120,
    marginBottom: 12,
  },
  carImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: -20,
  },
  carName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 4,
  },
  carPrice: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.primary,
  },
});

export default HomeScreen;

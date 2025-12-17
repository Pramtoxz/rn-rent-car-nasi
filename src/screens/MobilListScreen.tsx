import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { mobilService, Mobil, MobilFilters } from '../services/mobilService';

const MobilListScreen = ({ navigation }: any) => {
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'manual' | 'automatic'>('all');

  useEffect(() => {
    loadMobils();
  }, [selectedFilter, searchQuery]);

  const loadMobils = async () => {
    setLoading(true);
    try {
      const filters: MobilFilters = {
        status: 'tersedia',
      };
      if (selectedFilter !== 'all') {
        filters.transmisi = selectedFilter;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }
      const response = await mobilService.getAllMobil(filters);
      setMobils(response.data);
    } catch (error) {
      console.log('Error loading mobils:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMobilCard = ({ item }: { item: Mobil }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CarDetails', { carId: item.id })}>
      <Image source={{ uri: item.foto_mobil }} style={styles.carImage} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.carName}>{item.nama_mobil}</Text>
        <Text style={styles.carMerk}>{item.merk} • {item.tahun}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.carPrice}>{item.harga_formatted}</Text>
          <View style={styles.badge}>
            <Icon name="settings" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>{item.jenis_transmisi}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Mobil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Icon name="search" size={20} color={colors.secondary} />
          <TextInput
            placeholder="Cari mobil..."
            placeholderTextColor={colors.secondary}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}>
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Semua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'manual' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('manual')}>
          <Text style={[styles.filterText, selectedFilter === 'manual' && styles.filterTextActive]}>
            Manual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'automatic' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('automatic')}>
          <Text style={[styles.filterText, selectedFilter === 'automatic' && styles.filterTextActive]}>
            Automatic
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={mobils}
          renderItem={renderMobilCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
  },
  filterTextActive: {
    fontFamily: fonts.bold,
    color: colors.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background,
  },
  cardContent: {
    padding: 16,
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
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.primary,
  },
});

export default MobilListScreen;

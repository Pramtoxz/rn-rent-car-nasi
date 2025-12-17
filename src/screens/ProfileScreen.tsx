import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // Navigation will be handled by AuthContext
        },
      },
    ]);
  };

  const getStatusColor = () => {
    switch (user?.status_verifikasi) {
      case 'verified':
        return '#4CAF50';
      case 'pending':
        return colors.primary;
      case 'rejected':
        return '#F44336';
      default:
        return colors.secondary;
    }
  };

  const getStatusText = () => {
    switch (user?.status_verifikasi) {
      case 'verified':
        return 'Terverifikasi';
      case 'pending':
        return 'Menunggu Verifikasi';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Belum Verifikasi';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon name="user" size={40} color={colors.white} />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>No. HP</Text>
                <Text style={styles.infoValue}>{user?.nohp}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="mail" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            {user?.nik && (
              <View style={styles.infoRow}>
                <Icon name="credit-card" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>NIK</Text>
                  <Text style={styles.infoValue}>{user.nik}</Text>
                </View>
              </View>
            )}

            {user?.alamat && (
              <View style={styles.infoRow}>
                <Icon name="map-pin" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Alamat</Text>
                  <Text style={styles.infoValue}>{user.alamat}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {user?.status_verifikasi !== 'verified' && (
          <View style={styles.warningCard}>
            <Icon name="alert-circle" size={24} color={colors.primary} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Status Verifikasi</Text>
              <Text style={styles.warningText}>
                {user?.status_verifikasi === 'pending'
                  ? 'Akun Anda sedang dalam proses verifikasi oleh admin. Anda belum dapat melakukan booking mobil.'
                  : user?.status_verifikasi === 'rejected'
                  ? 'Akun Anda ditolak oleh admin. Silakan hubungi customer service untuk informasi lebih lanjut.'
                  : 'Lengkapi profil Anda untuk dapat melakukan booking mobil.'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
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
  profileCard: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  warningText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#F44336',
  },
});

export default ProfileScreen;

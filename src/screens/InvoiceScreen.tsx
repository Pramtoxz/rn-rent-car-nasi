import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { bookingService } from '../services/bookingService';
import { showAlert } from '../utils/alert';

const InvoiceScreen = ({ navigation, route }: any) => {
  const { bookingData } = route.params;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await bookingService.downloadInvoice(bookingData.id, bookingData.kode_booking);
      showAlert.success('Faktur berhasil didownload');
    } catch (error: any) {
      console.log('Download Error:', error);
      // Menampilkan pesan error spesifik (misal: "Server error (401)")
      const msg = error.message || 'Gagal download';
      showAlert.error(`${msg}. Jika terus gagal, gunakan tombol "BUKA DI BROWSER" di bawah.`);
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenBrowser = async () => {
    try {
      await bookingService.openInvoiceInBrowser(bookingData.id);
    } catch {
      showAlert.error('Gagal membuka browser');
    }
  };

  const renderDetailRow = (label: string, value: string, isTotal?: boolean) => (
    <View style={[styles.detailRow, isTotal && styles.totalRow]}>
      <Text style={[styles.detailLabel, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.detailValue, isTotal && styles.totalValue]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="x" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Faktur Pembayaran</Text>
        <TouchableOpacity 
          onPress={handleDownload} 
          disabled={downloading}
          style={styles.downloadIconBtn}
        >
          {downloading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon name="download" size={22} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.invoiceCard}>
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>RentCarNasi</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>OFFICIAL RECEIPT</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>KODE BOOKING</Text>
              <Text style={styles.infoValue}>{bookingData.kode_booking}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>TANGGAL TRANSKASI</Text>
              <Text style={styles.infoValue}>{new Date(bookingData.created_at).toLocaleDateString('id-ID')}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DETAIL PENYEWA</Text>
          </View>
          {renderDetailRow('Nama Pelanggan', bookingData.user?.name || 'Customer')}
          {renderDetailRow('Status Pembayaran', bookingData.status_pembayaran === 'verified' ? 'LUNAS' : 'PENDING')}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DETAIL KENDARAAN</Text>
          </View>
          {renderDetailRow('Unit Mobil', bookingData.mobil.nama_mobil)}
          {renderDetailRow('Plat Nomor', bookingData.mobil.plat_nomor)}
          {renderDetailRow('Durasi Sewa', `${bookingData.durasi_hari} Hari`)}
          {renderDetailRow('Periode', `${bookingData.tanggal_mulai} - ${bookingData.tanggal_selesai}`)}

          <View style={styles.divider} />

          {renderDetailRow('Harga / Hari', `Rp ${bookingData.harga_per_hari.toLocaleString('id-ID')}`)}
          {renderDetailRow('Subtotal', bookingData.total_harga_formatted)}
          
          <View style={styles.totalContainer}>
            {renderDetailRow('TOTAL BAYAR', bookingData.total_harga_formatted, true)}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Terima kasih telah mempercayai layanan kami.</Text>
            <Text style={styles.footerNote}>Simpan faktur ini sebagai bukti pembayaran yang sah.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.downloadButton, downloading && styles.disabledBtn]} 
          onPress={handleDownload}
          disabled={downloading}
        >
          <Icon name="download" size={20} color={colors.background} />
          <Text style={styles.downloadButtonText}>
            {downloading ? 'MEMPROSES...' : 'DOWNLOAD PDF (NATIVE)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.browserButton} 
          onPress={handleOpenBrowser}
        >
          <Icon name="globe" size={20} color={colors.primary} />
          <Text style={styles.browserButtonText}>BUKA DI WEB BROWSER</Text>
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
  downloadIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  invoiceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  brandSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandName: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(236, 174, 54, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 174, 54, 0.3)',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: fonts.book,
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 4,
    letterSpacing: 1,
  },
  infoValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.secondary,
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: fonts.book,
    fontSize: 13,
    color: colors.secondary,
  },
  detailValue: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  totalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalRow: {
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.white,
  },
  totalValue: {
    fontSize: 20,
    color: colors.primary,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
    marginBottom: 4,
  },
  footerNote: {
    fontFamily: fonts.book,
    fontSize: 10,
    color: colors.secondary,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.background,
    letterSpacing: 1,
  },
  browserButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  browserButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    letterSpacing: 1,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});

export default InvoiceScreen;

import api from './api';
import { Mobil } from './mobilService';
import { uploadService } from './uploadService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform, PermissionsAndroid, Linking } from 'react-native';

export interface CreateBookingRequest {
  mobil_id: number;
  tanggal_mulai: string; // Format: YYYY-MM-DD
  tanggal_selesai: string; // Format: YYYY-MM-DD
  catatan_customer?: string;
}

export interface Booking {
  id: number;
  kode_booking: string;
  mobil: Mobil;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_hari: number;
  harga_per_hari: number;
  total_harga: number;
  total_harga_formatted: string;
  bukti_bayar: string | null;
  status_pembayaran: 'pending' | 'verified' | 'rejected';
  status_booking: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  catatan_customer: string | null;
  catatan_admin: string | null;
  faktur_url?: string;
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingRequest) {
    const response = await api.post('/booking', data);
    return response.data;
  },

  async uploadBuktiBayar(bookingId: number, data: any) {
    const response = await uploadService.uploadWithFormData(`/booking/${bookingId}/upload-bukti`, data);
    return response;
  },

  async getMyBookings(): Promise<{ success: boolean; message: string; data: Booking[] }> {
    const response = await api.get('/booking');
    return response.data;
  },

  async getBookingDetail(id: number): Promise<{ success: boolean; message: string; data: Booking }> {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },

  async downloadInvoice(bookingId: number, bookingCode: string): Promise<string> {
    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) throw new Error('Izin penyimpanan ditolak');

    const token = await AsyncStorage.getItem('token');
    const { config, fs } = ReactNativeBlobUtil;
    const { dirs } = fs;
    const url = `${api.defaults.baseURL}/booking/${bookingId}/faktur`;
    
    console.log('Native download starting for:', url);

    const filename = `Faktur-${bookingCode}-${Math.floor(Date.now() / 1000)}.pdf`;
    
    try {
      // Langkah 1: Download ke cache internal dulu (lebih stabil daripada langsung ke DownloadManager)
      const res = await config({
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', url, {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      });

      const status = res.info().status;
      console.log('Download fetch status:', status);

      if (status !== 200) {
        if (await fs.exists(res.path())) await fs.unlink(res.path());
        throw new Error(`Server error (${status}). Pastikan backend sudah diupdate.`);
      }

      const internalPath = res.path();
      
      // Langkah 2: Jika Android, coba salin ke folder publik agar terlihat di "Downloads"
      if (Platform.OS === 'android') {
        const publicPath = `${dirs.DownloadDir}/${filename}`;
        try {
          await fs.cp(internalPath, publicPath);
          console.log('File copied to public downloads:', publicPath);
          // Tambahkan ke sistem download agar muncul di notifikasi & file manager
          ReactNativeBlobUtil.android.addCompleteDownload({
            title: filename,
            description: 'Faktur Rental Mobil',
            mime: 'application/pdf',
            path: publicPath,
            showNotification: true,
          });
          
          // Buka file
          ReactNativeBlobUtil.android.actionViewIntent(publicPath, 'application/pdf');
          return publicPath;
        } catch (copyError) {
          console.log('Copy to public failed, opening from internal:', copyError);
          ReactNativeBlobUtil.android.actionViewIntent(internalPath, 'application/pdf');
          return internalPath;
        }
      } else {
        ReactNativeBlobUtil.ios.previewDocument(internalPath);
        return internalPath;
      }
    } catch (err: any) {
      console.error('Download error detail:', err);
      throw new Error(err.message || 'Gagal download');
    }
  },

  async openInvoiceInBrowser(bookingId: number) {
    try {
      const token = await AsyncStorage.getItem('token');
      // Gunakan URL API langsung dengan token di query string
      // Pastikan backend menghandle token dari query string jika Bearer header tidak ada (karena di browser)
      const url = `${api.defaults.baseURL}/booking/${bookingId}/faktur?token=${token}`;
      console.log('Opening invoice in browser:', url);
      await Linking.openURL(url);
    } catch (error: any) {
      console.error('Error opening link:', error);
      throw new Error('Gagal membuka browser');
    }
  },

  async requestStoragePermission() {
    if (Platform.OS !== 'android') return true;
    
    // Android 13+ tidak butuh WRITE_EXTERNAL_STORAGE untuk DownloadDir via DownloadManager
    if (Number(Platform.Version) >= 33) return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Izin Penyimpanan',
          message: 'Aplikasi butuh akses penyimpanan untuk mendownload faktur',
          buttonNeutral: 'Nanti',
          buttonNegative: 'Batal',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  },
};

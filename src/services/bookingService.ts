import api from './api';
import { Mobil } from './mobilService';

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
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingRequest) {
    const response = await api.post('/booking', data);
    return response.data;
  },

  async uploadBuktiBayar(bookingId: number, file: FormData) {
    try {
      console.log('bookingService - Upload URL:', `/booking/${bookingId}/upload-bukti`);
      const response = await api.post(`/booking/${bookingId}/upload-bukti`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          // Let axios handle FormData automatically
          return data;
        },
      });
      console.log('bookingService - Upload success:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('bookingService - Upload error:', error.response?.data);
      throw error;
    }
  },

  async getMyBookings(): Promise<{ success: boolean; message: string; data: Booking[] }> {
    const response = await api.get('/booking');
    return response.data;
  },

  async getBookingDetail(id: number): Promise<{ success: boolean; message: string; data: Booking }> {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },
};

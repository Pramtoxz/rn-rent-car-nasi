import api from './api';
import { Mobil } from './mobilService';
import { uploadService } from './uploadService';

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
};

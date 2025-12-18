import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadService } from './uploadService';

export interface User {
  id: number;
  name: string;
  email: string;
  nohp: string;
  nik?: string;
  alamat?: string;
  status_verifikasi: 'pending' | 'verified' | 'rejected';
  role: string;
}

export const authService = {
  async requestOTP(nohp: string) {
    const response = await api.post('/auth/request-otp', { nohp });
    return response.data;
  },

  async verifyOTP(nohp: string, otp_code: string) {
    const response = await api.post('/auth/verify-otp', { nohp, otp_code });
    if (response.data.data.token) {
      await AsyncStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  async completeProfile(data: any) {
    const response = await uploadService.uploadWithFormData('/auth/complete-profile', data);
    return response;
  },

  async updateProfile(data: any) {
    // Gunakan rn-fetch-blob untuk upload file yang lebih reliable
    const response = await uploadService.uploadWithFormData('/profile/update', data);
    return response;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/profile');
    return response.data.data;
  },

  async logout() {
    await api.post('/logout');
    await AsyncStorage.removeItem('token');
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};

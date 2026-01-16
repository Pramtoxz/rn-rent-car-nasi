import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://rentcarnasi.myserverku.web.id/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Jangan override Content-Type jika sudah diset (untuk multipart/form-data)
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type']; // Biarkan axios yang set otomatis
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Log detailed error for validation (422) or other errors
      if (error.response.status === 422) {
        console.log('--- BACKEND VALIDATION ERROR ---');
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
        console.log('---------------------------------');
      } else if (error.response.status === 401) {
        console.log('Unauthorized Access (401)');
      } else {
        console.log(`Backend Error (${error.response.status}):`, error.response.data);
      }
    } else if (error.request) {
      console.log('Network Error: No response received');
    } else {
      console.log('Request Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export const updateFCMToken = async (fcmToken: string) => {
  return await api.post('/fcm-token', { fcm_token: fcmToken });
};

export default api;

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

export default api;

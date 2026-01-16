import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';

const BASE_URL = 'https://rentcarnasi.myserverku.web.id/api';

export const uploadService = {
  async uploadWithFormData(endpoint: string, data: any): Promise<any> {
    const token = await AsyncStorage.getItem('token');
    const url = `${BASE_URL}${endpoint}`;

    console.log('=== Upload Service Debug ===');
    console.log('URL:', url);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('===========================');

    try {
      const multipartData: any[] = [];

      for (const key in data) {
        const value = data[key];
        
        if (value && typeof value === 'object' && value.uri) {
          let filePath = value.uri;
          // Hanya hapus file://, biarkan content:// tetap ada untuk Android
          if (filePath.startsWith('file://')) {
            filePath = filePath.replace('file://', '');
          }
          
          multipartData.push({
            name: key,
            filename: value.name,
            type: value.type,
            data: ReactNativeBlobUtil.wrap(decodeURI(filePath)),
          });
        } else if (value !== null && value !== undefined) {
          multipartData.push({
            name: key,
            data: String(value),
          });
        }
      }

      const headers: any = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await ReactNativeBlobUtil.fetch(
        'POST',
        url,
        headers,
        multipartData
      );

      const status = response.info().status;
      const responseData = response.data;

      if (status >= 200 && status < 300) {
        try {
          return JSON.parse(responseData);
        } catch (e) {
          return { success: true, data: responseData };
        }
      } else {
        let errorMessage = 'Upload gagal';
        let errorData: any = { message: errorMessage };
        
        try {
          errorData = JSON.parse(responseData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          if (responseData.includes('<!DOCTYPE') || responseData.includes('<html')) {
            if (status === 404) {
              errorMessage = `Endpoint tidak ditemukan (404)`;
            } else if (status === 500) {
              errorMessage = `Server Error (500). Silakan cek log backend.`;
            } else if (status === 405) {
              errorMessage = `Method Not Allowed (405). Periksa route POST/PUT.`;
            } else {
              errorMessage = `Server Error (${status})`;
            }
          } else {
            errorMessage = `Upload gagal (${status}): ${responseData.substring(0, 50)}`;
          }
        }
        
        throw { 
          response: { 
            data: { message: errorMessage, ...errorData }, 
            status 
          } 
        };
      }
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      
      throw {
        response: {
          data: { message: error.message || 'Upload gagal. Cek koneksi internet.' },
          status: 0,
        },
      };
    }
  },
};

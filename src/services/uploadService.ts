import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';

const BASE_URL = 'https://rentcarnasi.myserverku.web.id/api';

export const uploadService = {
  async uploadWithFormData(endpoint: string, data: any): Promise<any> {
    const token = await AsyncStorage.getItem('token');
    const url = `${BASE_URL}${endpoint}`;

    try {
      const multipartData: any[] = [];

      for (const key in data) {
        const value = data[key];
        
        if (value && typeof value === 'object' && value.uri) {
          let filePath = value.uri;
          filePath = filePath.replace('file://', '').replace('content://', '');
          
          multipartData.push({
            name: key,
            filename: value.name,
            type: value.type,
            data: ReactNativeBlobUtil.wrap(filePath),
          });
        } else if (value !== null && value !== undefined) {
          multipartData.push({
            name: key,
            data: String(value),
          });
        }
      }

      const response = await ReactNativeBlobUtil.fetch(
        'POST',
        url,
        {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
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
              errorMessage = 'Endpoint tidak ditemukan';
            } else if (status === 500) {
              errorMessage = 'Server error. Coba lagi nanti.';
            } else {
              errorMessage = `Server error (${status})`;
            }
          } else {
            errorMessage = responseData.substring(0, 200);
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

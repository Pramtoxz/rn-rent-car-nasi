import api from './api';

export interface Mobil {
  id: number;
  nama_mobil: string;
  merk: string;
  plat_nomor: string;
  tahun: number;
  warna: string;
  jenis_transmisi: 'manual' | 'automatic';
  kapasitas_penumpang: number;
  harga_sewa_per_hari: number;
  harga_formatted: string;
  deskripsi: string;
  foto_mobil: string;
  status: 'tersedia' | 'disewa' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface MobilFilters {
  merk?: string;
  transmisi?: 'manual' | 'automatic';
  status?: 'tersedia' | 'disewa' | 'maintenance';
  search?: string;
}

export const mobilService = {
  async getAllMobil(filters?: MobilFilters) {
    const params = new URLSearchParams();
    if (filters?.merk) params.append('merk', filters.merk);
    if (filters?.transmisi) params.append('transmisi', filters.transmisi);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/mobil?${queryString}` : '/mobil';
    const response = await api.get(url);
    return response.data;
  },

  async getMobilDetail(id: number): Promise<Mobil> {
    const response = await api.get(`/mobil/${id}`);
    return response.data.data;
  },

  async getRekomendasiMobil() {
    const response = await api.get('/mobil/rekomendasi');
    return response.data;
  },
};

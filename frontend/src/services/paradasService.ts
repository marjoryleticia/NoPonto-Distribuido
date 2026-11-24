
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Rota {
  id: number;
  nome: string;
}

export interface Parada {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  rotaId: number | null;
  rota?: Rota | null;
}

export interface ParadaPayload {
  nome: string;
  latitude: number;
  longitude: number;
  rotaId?: number | null;
}

export interface ParadasResponse {
  dados: Parada[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export const paradasService = {
  listar: async (page = 1, limit = 10, nome = '') => {
    const response = await api.get<ParadasResponse>('/paradas', {
      params: { page, limit, nome },
    });

    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await api.get<Parada>(`/paradas/${id}`);

    return response.data;
  },

  criar: async (data: ParadaPayload) => {
    const response = await api.post<Parada>('/paradas', data);

    return response.data;
  },

  atualizar: async (id: number, data: Partial<ParadaPayload>) => {
    const response = await api.put<Parada>(`/paradas/${id}`, data);

    return response.data;
  },

  excluir: async (id: number) => {
    const response = await api.delete<Parada>(`/paradas/${id}`);

    return response.data;
  },
};

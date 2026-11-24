
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Rota {
  id: number;
  nome: string;
  descricao: string | null;
  onibus?: unknown[];
  paradas?: unknown[];
}

export interface RotaPayload {
  nome: string;
  descricao?: string;
}

export interface RotasResponse {
  dados: Rota[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export const rotasService = {
  listar: async (page = 1, limit = 10, nome = '') => {
    const response = await api.get<RotasResponse>('/rotas', {
      params: { page, limit, nome },
    });

    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await api.get<Rota>(`/rotas/${id}`);
    return response.data;
  },

  criar: async (dados: RotaPayload) => {
    const response = await api.post<Rota>('/rotas', dados);
    return response.data;
  },

  atualizar: async (id: number, dados: RotaPayload) => {
    const response = await api.put<Rota>(`/rotas/${id}`, dados);
    return response.data;
  },

  excluir: async (id: number) => {
    const response = await api.delete<Rota>(`/rotas/${id}`);
    return response.data;
  },
};

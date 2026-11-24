
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface DashboardDados {
  totalOnibus: number;
  totalRotas: number;
  totalParadas: number;
  onibusAtivos: number;
}

export const dashboardService = {
  async buscarDados(): Promise<DashboardDados> {
    const [onibus, rotas, paradas] = await Promise.all([
      api.get('/onibus', { params: { page: 1, limit: 100 } }),
      api.get('/rotas', { params: { page: 1, limit: 100 } }),
      api.get('/paradas', { params: { page: 1, limit: 100 } }),
    ]);

    const listaOnibus = onibus.data.dados ?? [];
    const listaRotas = rotas.data.dados ?? [];
    const listaParadas = paradas.data.dados ?? [];

    return {
      totalOnibus: onibus.data.total ?? listaOnibus.length,
      totalRotas: rotas.data.total ?? listaRotas.length,
      totalParadas: paradas.data.total ?? listaParadas.length,
      onibusAtivos: listaOnibus.filter(
        (bus: any) => bus.status === 'ATIVO'
      ).length,
    };
  },
};

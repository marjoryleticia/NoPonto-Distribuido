
import './Paradas.css';

import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react';

import ParadaForm from './ParadaForm';
import {
  paradasService,
  type Parada,
  type ParadaPayload,
} from '../services/paradasService';

export default function Paradas() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [formAberto, setFormAberto] = useState(false);
  const [paradaEditando, setParadaEditando] = useState<Parada | null>(null);

  const limite = 10;

  async function carregarParadas() {
    try {
      setCarregando(true);
      setErro('');

      const resposta = await paradasService.listar(
        pagina,
        limite,
        pesquisa,
      );

      setParadas(resposta.dados);
      setTotal(resposta.total);
      setTotalPaginas(resposta.totalPaginas);
    } catch (error) {
      console.error('Erro ao carregar paradas:', error);
      setErro('Não foi possível carregar as paradas.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarParadas();
  }, [pagina, pesquisa]);

  function abrirCadastro() {
    setParadaEditando(null);
    setFormAberto(true);
  }

  function abrirEdicao(parada: Parada) {
    setParadaEditando(parada);
    setFormAberto(true);
  }

  function fecharFormulario() {
    setFormAberto(false);
    setParadaEditando(null);
  }

  async function salvarParada(dados: ParadaPayload) {
    try {
      if (paradaEditando) {
        await paradasService.atualizar(paradaEditando.id, dados);
      } else {
        await paradasService.criar(dados);
      }

      fecharFormulario();

      if (!paradaEditando && pagina !== 1) {
        setPagina(1);
      } else {
        await carregarParadas();
      }
    } catch (error) {
      console.error('Erro ao salvar parada:', error);
      throw error;
    }
  }

  async function excluirParada(parada: Parada) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a parada "${parada.nome}"?`,
    );

    if (!confirmar) return;

    try {
      setErro('');
      await paradasService.excluir(parada.id);

      if (paradas.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      } else {
        await carregarParadas();
      }
    } catch (error) {
      console.error('Erro ao excluir parada:', error);
      setErro('Não foi possível excluir a parada.');
    }
  }

  return (
    <div className="paradas-container">
      <div className="paradas-header">
        <div>
          <h1>Paradas</h1>
          <p>Gerencie as paradas do sistema de transporte.</p>
        </div>

        <button className="paradas-btn-primary" onClick={abrirCadastro}>
          <Plus size={18} />
          Nova parada
        </button>
      </div>

      <div className="paradas-stats">
        <div className="paradas-stat-card">
          <span>Total de paradas cadastradas</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="paradas-toolbar">
        <div className="paradas-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar parada pelo nome..."
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
              setPagina(1);
            }}
          />
        </div>

        <button
          className="paradas-btn-secondary"
          onClick={carregarParadas}
          title="Atualizar listagem"
          disabled={carregando}
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {erro && (
        <div className="paradas-error">
          {erro}
        </div>
      )}

      <div className="paradas-table-container">
        <table className="paradas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da parada</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Rota</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={6} className="paradas-empty">
                  Carregando paradas...
                </td>
              </tr>
            ) : paradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="paradas-empty">
                  Nenhuma parada encontrada.
                </td>
              </tr>
            ) : (
              paradas.map((parada) => (
                <tr key={parada.id}>
                  <td>{parada.id}</td>

                  <td>
                    <div className="paradas-name">
                      <MapPin size={16} />
                      {parada.nome}
                    </div>
                  </td>

                  <td>{parada.latitude}</td>
                  <td>{parada.longitude}</td>

                  <td>
                    {parada.rota?.nome ?? 'Sem rota'}
                  </td>

                  <td>
                    <div className="paradas-actions">
                      <button
                        className="paradas-action-edit"
                        title="Editar parada"
                        onClick={() => abrirEdicao(parada)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="paradas-action-delete"
                        title="Excluir parada"
                        onClick={() => excluirParada(parada)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="paradas-pagination">
        <span>{total} parada(s) encontrada(s)</span>

        <div className="paradas-pagination-buttons">
          <button
            disabled={pagina <= 1 || carregando}
            onClick={() => setPagina((atual) => atual - 1)}
          >
            Anterior
          </button>

          <span>
            Página {pagina} de {Math.max(totalPaginas, 1)}
          </span>

          <button
            disabled={
              pagina >= totalPaginas ||
              carregando ||
              totalPaginas === 0
            }
            onClick={() => setPagina((atual) => atual + 1)}
          >
            Próxima
          </button>
        </div>
      </div>

      {formAberto && (
        <ParadaForm
          parada={paradaEditando}
          onSalvar={salvarParada}
          onCancelar={fecharFormulario}
        />
      )}
    </div>
  );
}

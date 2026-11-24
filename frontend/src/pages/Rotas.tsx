
import { useEffect, useState, type FormEvent } from 'react';
import {
  Search,
  Plus,
  Route as RouteIcon,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  BusFront,
  MapPin,
} from 'lucide-react';

import {
  rotasService,
  type Rota,
  type RotaPayload,
} from '../services/rotasService';

import './Rotas.css';

const LIMITE = 10;

function Rotas() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [formAberto, setFormAberto] = useState(false);
  const [rotaEditando, setRotaEditando] = useState<Rota | null>(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function carregarRotas() {
    try {
      setCarregando(true);
      setErro('');

      const resposta = await rotasService.listar(
        pagina,
        LIMITE,
        pesquisa,
      );

      setRotas(resposta.dados);
      setTotal(resposta.total);
      setTotalPaginas(resposta.totalPaginas);
    } catch {
      setErro('Não foi possível carregar as rotas.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRotas();
  }, [pagina, pesquisa]);

  function abrirCadastro() {
    setRotaEditando(null);
    setNome('');
    setDescricao('');
    setErro('');
    setFormAberto(true);
  }

  function abrirEdicao(rota: Rota) {
    setRotaEditando(rota);
    setNome(rota.nome);
    setDescricao(rota.descricao ?? '');
    setErro('');
    setFormAberto(true);
  }

  function fecharFormulario() {
    setFormAberto(false);
    setRotaEditando(null);
    setNome('');
    setDescricao('');
  }

  async function salvarRota(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro('');
      setMensagem('');

      const dados: RotaPayload = {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
      };

      if (rotaEditando) {
        await rotasService.atualizar(rotaEditando.id, dados);
        setMensagem('Rota atualizada com sucesso!');
      } else {
        await rotasService.criar(dados);
        setMensagem('Rota cadastrada com sucesso!');
      }

      fecharFormulario();

      if (pagina !== 1) {
        setPagina(1);
      } else {
        await carregarRotas();
      }
    } catch {
      setErro('Não foi possível salvar a rota. Verifique os dados.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluirRota(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir esta rota?',
    );

    if (!confirmar) return;

    try {
      setErro('');
      setMensagem('');

      await rotasService.excluir(id);

      setMensagem('Rota excluída com sucesso!');

      if (rotas.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      } else {
        await carregarRotas();
      }
    } catch {
      setErro(
        'Não foi possível excluir a rota. Verifique se existem vínculos com ônibus ou paradas.',
      );
    }
  }

  return (
    <section className="rotas-container">
      <div className="rotas-cabecalho">
        <div>
          <h3>Gerenciamento de rotas</h3>
          <p>Cadastre e organize as rotas do sistema.</p>
        </div>

        <button className="rotas-botao-principal" onClick={abrirCadastro}>
          <Plus size={18} />
          Nova rota
        </button>
      </div>

      <div className="rotas-estatistica">
        <RouteIcon size={26} />
        <div>
          <span>Total de rotas</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="rotas-toolbar">
        <div className="rotas-pesquisa">
          <Search size={18} />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
              setPagina(1);
            }}
            placeholder="Pesquisar rota pelo nome..."
          />
        </div>

        <button
          className="rotas-botao-secundario"
          onClick={carregarRotas}
          title="Atualizar"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {mensagem && (
        <div className="rotas-sucesso">{mensagem}</div>
      )}

      {erro && (
        <div className="rotas-erro">{erro}</div>
      )}

      {carregando ? (
        <p className="rotas-vazio">Carregando rotas...</p>
      ) : rotas.length === 0 ? (
        <div className="rotas-vazio">
          <RouteIcon size={35} />
          <p>Nenhuma rota encontrada.</p>
        </div>
      ) : (
        <div className="rotas-tabela-wrapper">
          <table className="rotas-tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ônibus</th>
                <th>Paradas</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {rotas.map((rota) => (
                <tr key={rota.id}>
                  <td>#{rota.id}</td>

                  <td className="rotas-nome">
                    {rota.nome}
                  </td>

                  <td>
                    {rota.descricao || 'Sem descrição'}
                  </td>

                  <td>
                    <span className="rotas-vinculo">
                      <BusFront size={15} />
                      {rota.onibus?.length ?? 0}
                    </span>
                  </td>

                  <td>
                    <span className="rotas-vinculo">
                      <MapPin size={15} />
                      {rota.paradas?.length ?? 0}
                    </span>
                  </td>

                  <td>
                    <div className="rotas-acoes">
                      <button
                        onClick={() => abrirEdicao(rota)}
                        title="Editar rota"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="rotas-excluir"
                        onClick={() => excluirRota(rota.id)}
                        title="Excluir rota"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="rotas-paginacao">
          <button
            disabled={pagina <= 1}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>

          <span>
            Página {pagina} de {totalPaginas}
          </span>

          <button
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Próxima
          </button>
        </div>
      )}

      {formAberto && (
        <div className="rotas-modal-overlay">
          <div className="rotas-modal">
            <div className="rotas-modal-cabecalho">
              <div>
                <h3>
                  {rotaEditando ? 'Editar rota' : 'Nova rota'}
                </h3>
                <p>Preencha as informações da rota.</p>
              </div>

              <button onClick={fecharFormulario}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={salvarRota}>
              <label htmlFor="rota-nome">Nome da rota</label>
              <input
                id="rota-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Centro - Palmares"
                required
                maxLength={255}
              />

              <label htmlFor="rota-descricao">Descrição</label>
              <textarea
                id="rota-descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o trajeto ou outras informações..."
                rows={4}
              />

              <div className="rotas-modal-acoes">
                <button
                  type="button"
                  className="rotas-cancelar"
                  onClick={fecharFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rotas-botao-principal"
                  disabled={salvando}
                >
                  {salvando
                    ? 'Salvando...'
                    : rotaEditando
                      ? 'Salvar alterações'
                      : 'Cadastrar rota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Rotas;


import { useEffect, useState, type FormEvent } from 'react'
import {
  BusFront,
  LayoutDashboard,
  MapPin,
  Route,
  Bell,
  Search,
  Menu,
  RefreshCw,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'

import { dashboardService, type DashboardDados } from './services/dashboardService'
import MapaOnibus from './components/MapaOnibus'
import Rotas from './pages/Rotas'
import Paradas from './pages/Paradas'
import Usuarios from './pages/Usuarios'

type Pagina = 'painel' | 'onibus' | 'rotas' | 'paradas' | 'usuarios'

type Onibus = {
  id: number
  placa: string
  identificacaoRFID: string
  modelo: string
  status: string
  rotaId: number | null
}

function App() {
  const [pagina, setPagina] = useState<Pagina>('painel')
  const [onibus, setOnibus] = useState<Onibus[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [placa, setPlaca] = useState('')
  const [modelo, setModelo] = useState('')
  const [identificacaoRFID, setIdentificacaoRFID] = useState('')
  const [status, setStatus] = useState('ATIVO')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [dadosDashboard, setDadosDashboard] = useState<DashboardDados>({
    totalOnibus: 0,
    totalRotas: 0,
    totalParadas: 0,
    onibusAtivos: 0,
  })

  const [carregandoDashboard, setCarregandoDashboard] = useState(true)

  function limparFormulario() {
    setPlaca('')
    setModelo('')
    setIdentificacaoRFID('')
    setStatus('ATIVO')
    setEditandoId(null)
    setMostrarFormulario(false)
  }

  async function buscarOnibus() {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await fetch('http://localhost:3000/onibus')

      if (!resposta.ok) {
        throw new Error('Não foi possível buscar os ônibus.')
      }

      const resultado = await resposta.json()
      setOnibus(resultado.dados ?? [])
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao conectar com a API.',
      )
    } finally {
      setCarregando(false)
    }
  }

  async function carregarDashboard() {
    try {
      setCarregandoDashboard(true)
      const dados = await dashboardService.buscarDados()
      setDadosDashboard(dados)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setCarregandoDashboard(false)
    }
  }

  async function cadastrarOnibus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSalvando(true)
      setErro('')
      setMensagem('')

      const editando = editandoId !== null

      const resposta = await fetch(
        editando
          ? `http://localhost:3000/onibus/${editandoId}`
          : 'http://localhost:3000/onibus',
        {
          method: editando ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placa,
            modelo,
            identificacaoRFID,
            status,
          }),
        },
      )

      const resultado = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          resultado.message
            ? String(
                Array.isArray(resultado.message)
                  ? resultado.message.join(', ')
                  : resultado.message,
              )
            : 'Não foi possível salvar o ônibus.',
        )
      }

      setMensagem(
        editando
          ? 'Ônibus atualizado com sucesso!'
          : 'Ônibus cadastrado com sucesso!',
      )

      limparFormulario()
      await buscarOnibus()
      await carregarDashboard()
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar ônibus.',
      )
    } finally {
      setSalvando(false)
    }
  }

  function editarOnibus(veiculo: Onibus) {
    setPlaca(veiculo.placa)
    setModelo(veiculo.modelo)
    setIdentificacaoRFID(veiculo.identificacaoRFID)
    setStatus(veiculo.status)
    setEditandoId(veiculo.id)
    setMostrarFormulario(true)
    setErro('')
    setMensagem('')
  }

  async function excluirOnibus(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este ônibus?',
    )

    if (!confirmar) return

    try {
      setErro('')
      setMensagem('')

      const resposta = await fetch(
        `http://localhost:3000/onibus/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível excluir o ônibus.')
      }

      setMensagem('Ônibus excluído com sucesso!')
      await buscarOnibus()
      await carregarDashboard()
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir ônibus.',
      )
    }
  }

  useEffect(() => {
    if (pagina === 'onibus') {
      buscarOnibus()
    }

    if (pagina === 'painel') {
      carregarDashboard()
    }
  }, [pagina])

  const itensMenu: {
    id: Pagina
    nome: string
    icone: typeof LayoutDashboard
  }[] = [
    { id: 'painel', nome: 'Painel inicial', icone: LayoutDashboard },
    { id: 'onibus', nome: 'Ônibus', icone: BusFront },
    { id: 'rotas', nome: 'Rotas', icone: Route },
    { id: 'paradas', nome: 'Paradas', icone: MapPin },
    { id: 'usuarios', nome: 'Usuários', icone: Users },
  ]

  const titulos: Record<Pagina, string> = {
    painel: 'Painel inicial',
    onibus: 'Ônibus cadastrados',
    rotas: 'Rotas',
    paradas: 'Paradas',
    usuarios: 'Usuários',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 bg-[#123B5D] text-white flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <BusFront size={32} />
          <div>
            <h1 className="text-2xl font-bold">No Ponto</h1>
            <p className="text-xs text-blue-200">
              Seu ônibus. Sua rota. Seu tempo.
            </p>
          </div>
        </div>

        <nav className="space-y-3">
          {itensMenu.map((item) => {
            const Icone = item.icone

            return (
              <button
                key={item.id}
                onClick={() => setPagina(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                  pagina === item.id
                    ? 'bg-white/15'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icone size={20} />
                {item.nome}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 p-5 md:p-8">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Menu className="md:hidden text-slate-700" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {titulos[pagina]}
              </h2>
              <p className="text-slate-500">
                Acompanhe as informações do seu transporte.
              </p>
            </div>
          </div>

          <button className="p-3 bg-white rounded-xl shadow-sm">
            <Bell className="text-slate-600" />
          </button>
        </header>

        {pagina === 'painel' && (
          <>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm mb-8">
              <Search className="text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar ônibus ou rota..."
                className="outline-none w-full text-slate-700"
              />
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <BusFront className="text-blue-600 mb-4" size={30} />
                <p className="text-slate-500">Ônibus cadastrados</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {carregandoDashboard ? '...' : dadosDashboard.totalOnibus}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <Route className="text-emerald-600 mb-4" size={30} />
                <p className="text-slate-500">Rotas cadastradas</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {carregandoDashboard ? '...' : dadosDashboard.totalRotas}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <MapPin className="text-amber-500 mb-4" size={30} />
                <p className="text-slate-500">Paradas cadastradas</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {carregandoDashboard ? '...' : dadosDashboard.totalParadas}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <BusFront className="text-purple-600 mb-4" size={30} />
                <p className="text-slate-500">Ônibus ativos</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {carregandoDashboard ? '...' : dadosDashboard.onibusAtivos}
                </h3>
              </div>
            </section>

            <section className="mt-8 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-800">
                  Localização dos ônibus
                </h3>

                <button
                  onClick={carregarDashboard}
                  disabled={carregandoDashboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123B5D] text-white hover:bg-[#194d75] disabled:opacity-50"
                >
                  <RefreshCw size={17} />
                  Atualizar
                </button>
              </div>

              <p className="text-slate-500 mb-5">
                Acompanhe as posições registradas dos veículos.
              </p>

              <MapaOnibus />
            </section>
          </>
        )}

        {pagina === 'onibus' && (
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Lista de ônibus
                </h3>
                <p className="text-slate-500 text-sm">
                  Veículos cadastrados no sistema.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (mostrarFormulario) {
                      limparFormulario()
                    } else {
                      limparFormulario()
                      setMostrarFormulario(true)
                    }

                    setErro('')
                    setMensagem('')
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700"
                >
                  {mostrarFormulario ? 'Cancelar' : '+ Novo ônibus'}
                </button>

                <button
                  onClick={buscarOnibus}
                  disabled={carregando}
                  className="flex items-center gap-2 bg-[#123B5D] text-white px-4 py-2 rounded-xl hover:bg-[#194d75] disabled:opacity-50"
                >
                  <RefreshCw size={17} />
                  Atualizar
                </button>
              </div>
            </div>

            {mostrarFormulario && (
              <form
                onSubmit={cadastrarOnibus}
                className="bg-slate-50 border rounded-xl p-5 mb-6 space-y-4"
              >
                <h4 className="font-bold text-slate-800">
                  {editandoId !== null
                    ? 'Editar ônibus'
                    : 'Cadastrar novo ônibus'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="Placa do ônibus"
                    required
                    className="p-3 rounded-lg border outline-none"
                  />

                  <input
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Modelo do ônibus"
                    required
                    className="p-3 rounded-lg border outline-none"
                  />

                  <input
                    value={identificacaoRFID}
                    onChange={(e) => setIdentificacaoRFID(e.target.value)}
                    placeholder="Identificação RFID"
                    required
                    className="p-3 rounded-lg border outline-none"
                  />

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-3 rounded-lg border outline-none bg-white"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-[#123B5D] text-white px-5 py-3 rounded-xl hover:bg-[#194d75] disabled:opacity-50"
                >
                  {salvando
                    ? 'Salvando...'
                    : editandoId !== null
                      ? 'Salvar alterações'
                      : 'Cadastrar ônibus'}
                </button>
              </form>
            )}

            {mensagem && (
              <p className="text-green-700 bg-green-50 p-3 rounded-lg mb-4">
                {mensagem}
              </p>
            )}

            {carregando && (
              <p className="text-slate-500 py-6">Carregando ônibus...</p>
            )}

            {erro && (
              <p className="text-red-600 bg-red-50 p-4 rounded-xl mb-4">
                {erro}
              </p>
            )}

            {!carregando && !erro && onibus.length === 0 && (
              <p className="text-slate-500 py-6">
                Nenhum ônibus cadastrado.
              </p>
            )}

            {!carregando && onibus.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-slate-500 text-sm">
                      <th className="p-3">Placa</th>
                      <th className="p-3">Modelo</th>
                      <th className="p-3">Identificação RFID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {onibus.map((veiculo) => (
                      <tr
                        key={veiculo.id}
                        className="border-b last:border-0"
                      >
                        <td className="p-3 font-semibold text-slate-800">
                          {veiculo.placa}
                        </td>
                        <td className="p-3 text-slate-600">
                          {veiculo.modelo}
                        </td>
                        <td className="p-3 text-slate-600">
                          {veiculo.identificacaoRFID}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              veiculo.status === 'ATIVO'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {veiculo.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => editarOnibus(veiculo)}
                              title="Editar ônibus"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={19} />
                            </button>
                            <button
                              onClick={() => excluirOnibus(veiculo.id)}
                              title="Excluir ônibus"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={19} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {pagina === 'rotas' && <Rotas />}

        {pagina === 'paradas' && <Paradas />}

        {pagina === 'usuarios' && <Usuarios />}
      </main>
    </div>
  )
}

export default App

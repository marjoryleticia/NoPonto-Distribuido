
import { useEffect, useState, type FormEvent } from 'react'
import {
  Search,
  Plus,
  Users as UsersIcon,
  Pencil,
  Trash2,
  RefreshCw,
  X,
} from 'lucide-react'
import api from '../services/api';

type TipoUsuario = 'ALUNO' | 'RESPONSAVEL' | 'ADMIN' | 'PASSAGEIRO'

type Usuario = {
  id: number
  nome: string
  email: string
  tipo: TipoUsuario
}



const tiposUsuario: { value: TipoUsuario; label: string }[] = [
  { value: 'ALUNO', label: 'Aluno' },
  { value: 'RESPONSAVEL', label: 'Responsável' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'PASSAGEIRO', label: 'Passageiro' },
]

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [pesquisa, setPesquisa] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [formAberto, setFormAberto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipo] = useState<TipoUsuario>('PASSAGEIRO')

async function carregarUsuarios() {
  try {
    setCarregando(true)
    setErro('')

    const resposta = await api.get('/usuarios')
    const dados = resposta.data

    setUsuarios(Array.isArray(dados) ? dados : dados.dados ?? [])
  } catch (error: any) {
    setErro(
      error.response?.data?.message
        ? String(error.response.data.message)
        : 'Erro ao conectar com a API.',
    )
  } finally {
    setCarregando(false)
  }
}
  useEffect(() => {
    carregarUsuarios()
  }, [])

  function abrirCadastro() {
    setUsuarioEditando(null)
    setNome('')
    setEmail('')
    setSenha('')
    setTipo('PASSAGEIRO')
    setErro('')
    setMensagem('')
    setFormAberto(true)
  }

  function abrirEdicao(usuario: Usuario) {
    setUsuarioEditando(usuario)
    setNome(usuario.nome)
    setEmail(usuario.email)
    setSenha('')
    setTipo(usuario.tipo)
    setErro('')
    setMensagem('')
    setFormAberto(true)
  }

  function fecharFormulario() {
    setFormAberto(false)
    setUsuarioEditando(null)
    setNome('')
    setEmail('')
    setSenha('')
  }

 async function salvarUsuario(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  try {
    setSalvando(true)
    setErro('')
    setMensagem('')

    const editando = usuarioEditando !== null

    const dados: {
      nome: string
      email: string
      tipo: TipoUsuario
      senha?: string
    } = {
      nome: nome.trim(),
      email: email.trim(),
      tipo,
    }

    if (!editando || senha.trim()) {
      dados.senha = senha
    }

    if (editando) {
      await api.put(`/usuarios/${usuarioEditando.id}`, dados)
    } else {
      await api.post('/usuarios', dados)
    }

    setMensagem(
      editando
        ? 'Usuário atualizado com sucesso!'
        : 'Usuário cadastrado com sucesso!',
    )

    fecharFormulario()
    await carregarUsuarios()
  } catch (error: any) {
    const mensagemErro = error.response?.data?.message

    setErro(
      mensagemErro
        ? String(
            Array.isArray(mensagemErro)
              ? mensagemErro.join(', ')
              : mensagemErro,
          )
        : 'Erro ao salvar usuário.',
    )
  } finally {
    setSalvando(false)
  }
}

async function excluirUsuario(id: number) {
  const confirmar = window.confirm(
    'Tem certeza que deseja excluir este usuário?',
  )

  if (!confirmar) return

  try {
    setErro('')
    setMensagem('')

    await api.delete(`/usuarios/${id}`)

    setMensagem('Usuário excluído com sucesso!')
    await carregarUsuarios()
  } catch (error: any) {
    const mensagemErro = error.response?.data?.message

    setErro(
      mensagemErro
        ? String(
            Array.isArray(mensagemErro)
              ? mensagemErro.join(', ')
              : mensagemErro,
          )
        : 'Erro ao excluir usuário.',
    )
  }
}

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = pesquisa.toLowerCase()

    return (
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.tipo.toLowerCase().includes(termo)
    )
  })

  function nomeTipo(tipoUsuario: TipoUsuario) {
    return tiposUsuario.find((item) => item.value === tipoUsuario)?.label
      ?? tipoUsuario
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Gerenciamento de usuários
          </h3>
          <p className="text-slate-500 text-sm">
            Cadastre e organize os usuários do sistema.
          </p>
        </div>

        <button
          onClick={abrirCadastro}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700"
        >
          <Plus size={18} />
          Novo usuário
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-50 border rounded-xl p-4 mb-5">
        <UsersIcon className="text-blue-600" size={25} />
        <div>
          <p className="text-sm text-slate-500">Total de usuários</p>
          <p className="text-2xl font-bold text-slate-800">
            {usuarios.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 min-w- min-w-[220px] border rounded-xl px-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por nome, e-mail ou tipo..."
            className="w-full py-3 outline-none"
          />
        </div>

        <button
          onClick={carregarUsuarios}
          disabled={carregando}
          className="flex items-center gap-2 bg-[#123B5D] text-white px-4 py-2 rounded-xl hover:bg-[#194d75] disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Atualizar
        </button>
      </div>

      {mensagem && (
        <p className="text-green-700 bg-green-50 p-3 rounded-lg mb-4">
          {mensagem}
        </p>
      )}

      {erro && (
        <p className="text-red-600 bg-red-50 p-4 rounded-xl mb-4">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="text-slate-500 py-6">Carregando usuários...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          <UsersIcon size={35} className="mx-auto mb-2" />
          <p>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-slate-500 text-sm">
                <th className="p-3">ID</th>
                <th className="p-3">Nome</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="border-b last:border-0">
                  <td className="p-3 text-slate-500">#{usuario.id}</td>
                  <td className="p-3 font-semibold text-slate-800">
                    {usuario.nome}
                  </td>
                  <td className="p-3 text-slate-600">
                    {usuario.email}
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                      {nomeTipo(usuario.tipo)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => abrirEdicao(usuario)}
                        title="Editar usuário"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => excluirUsuario(usuario.id)}
                        title="Excluir usuário"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {usuarioEditando ? 'Editar usuário' : 'Novo usuário'}
                </h3>
                <p className="text-sm text-slate-500">
                  Preencha os dados do usuário.
                </p>
              </div>

              <button
                onClick={fecharFormulario}
                className="text-slate-500 hover:text-slate-800"
                title="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={salvarUsuario} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha {usuarioEditando && '(deixe em branco para manter)'}
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  required={!usuarioEditando}
                  minLength={6}
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo de usuário
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoUsuario)}
                  className="w-full p-3 border rounded-lg outline-none bg-white"
                >
                  {tiposUsuario.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={fecharFormulario}
                  className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="px-5 py-2 rounded-xl bg-[#123B5D] text-white hover:bg-[#194d75] disabled:opacity-50"
                >
                  {salvando
                    ? 'Salvando...'
                    : usuarioEditando
                      ? 'Salvar alterações'
                      : 'Cadastrar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Usuarios

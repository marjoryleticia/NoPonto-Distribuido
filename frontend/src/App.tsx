
import {
  BusFront,
  LayoutDashboard,
  MapPin,
  Route,
  Clock,
  Bell,
  Search,
  Menu,
} from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Menu lateral */}
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
          <a className="flex items-center gap-3 bg-white/15 p-3 rounded-xl">
            <LayoutDashboard size={20} />
            Painel inicial
          </a>

          <a className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">
            <BusFront size={20} />
            Ônibus
          </a>

          <a className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">
            <Route size={20} />
            Rotas
          </a>

          <a className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">
            <MapPin size={20} />
            Paradas
          </a>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-5 md:p-8">

        {/* Cabeçalho */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Menu className="md:hidden text-slate-700" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Painel inicial
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

        {/* Pesquisa */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm mb-8">
          <Search className="text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar ônibus ou rota..."
            className="outline-none w-full text-slate-700"
          />
        </div>

        {/* Cartões */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <BusFront className="text-blue-600 mb-4" size={30} />
            <p className="text-slate-500">Ônibus cadastrados</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">--</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Route className="text-emerald-600 mb-4" size={30} />
            <p className="text-slate-500">Rotas cadastradas</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">--</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <MapPin className="text-amber-500 mb-4" size={30} />
            <p className="text-slate-500">Paradas cadastradas</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">--</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Clock className="text-purple-600 mb-4" size={30} />
            <p className="text-slate-500">Localizações registradas</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">--</h3>
          </div>

        </section>

        {/* Área do mapa */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Localização dos ônibus
          </h3>

          <p className="text-slate-500 mb-5">
            Acompanhe as posições registradas dos veículos.
          </p>

          <div className="h-72 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400">
            <MapPin size={42} className="mb-3" />
            <p>Nosso mapa será exibido aqui.</p>
          </div>
        </section>

      </main>
    </div>
  )
}

export default App

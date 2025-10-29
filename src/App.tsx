import { useState } from 'react'
import { 
  LayoutDashboard, MessageSquare, BarChart3, Settings, 
  LogOut, Menu, X, Sparkles
} from 'lucide-react'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'

interface UserData {
  id: number
  nome: string
  email: string
  perfil: 'super_admin' | 'consultor'
  acesso_ia: number
  empresa: {
    cod: string
    nome: string
  }
}

function App() {
  const [user, setUser] = useState<UserData | null>(null)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'chat' | 'analytics'>('dashboard')
  const [showAdmin, setShowAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = (userData: UserData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('comlink_user')
    setUser(null)
    setCurrentPage('dashboard')
  }

  // ✅ CONTROLE: Só super_admin vê o botão admin
  const isSuperAdmin = user?.perfil === 'super_admin'

  if (!user) {
    return <Login onLogin={handleLogin} onAdminClick={() => setShowAdmin(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  COMLINK <Sparkles className="w-5 h-5 text-cyan-400" />
                </h1>
                <p className="text-slate-400 text-xs mt-1">{user.empresa.nome}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'dashboard'
                ? 'bg-cyan-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          {user.acesso_ia === 1 && (
            <button
              onClick={() => setCurrentPage('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === 'chat'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {sidebarOpen && <span>Chat IA</span>}
            </button>
          )}

          <button
            onClick={() => setCurrentPage('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'analytics'
                ? 'bg-cyan-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Analytics</span>}
          </button>

          {/* ✅ BOTÃO ADMIN - Só para super_admin */}
          {isSuperAdmin && (
            <button
              onClick={() => setShowAdmin(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:text-white hover:bg-purple-500/10 border border-purple-500/30 transition-all"
            >
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Admin</span>}
            </button>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-white font-medium text-sm">{user.nome}</p>
              <p className="text-slate-400 text-xs">{user.email}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                user.perfil === 'super_admin' ? 'bg-purple-500/20 text-purple-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {user.perfil === 'super_admin' ? 'Super Admin' : 'Consultor'}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {currentPage === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-slate-400 mb-8">Bem-vindo de volta, {user.nome}!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Cotações Ativas</h3>
                <p className="text-3xl font-bold text-white">24</p>
                <p className="text-green-400 text-sm mt-2">+12% vs mês anterior</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Taxa de Resposta</h3>
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-green-400 text-sm mt-2">+5% vs mês anterior</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Tempo Médio</h3>
                <p className="text-3xl font-bold text-white">2.4h</p>
                <p className="text-cyan-400 text-sm mt-2">-15min vs mês anterior</p>
              </div>
            </div>

            {user.acesso_ia === 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-12 h-12 text-cyan-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">COMLINK IA</h3>
                    <p className="text-slate-400">
                      Você não tem acesso à IA. Entre em contato com o administrador para ativar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'chat' && user.acesso_ia === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Chat IA</h2>
            <p className="text-slate-400 mb-8">Assistente inteligente para suas cotações</p>
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <div className="bg-slate-800 rounded-xl p-4 max-w-2xl">
                  <p className="text-white">Olá! Como posso ajudar você hoje?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'analytics' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
            <p className="text-slate-400 mb-8">Métricas e relatórios detalhados</p>
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-center py-12">
                Gráficos e relatórios em breve...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Admin Panel Modal */}
      {showAdmin && isSuperAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          userToken={localStorage.getItem('comlink_token') || undefined}
        />
      )}
    </div>
  )
}

export default App

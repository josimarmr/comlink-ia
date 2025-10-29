import { useState, useEffect, useRef } from 'react'
import { MessageCircle, BarChart3, Shield, Menu, X } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'

const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

interface Message {
  role: 'user' | 'assistant'
  content: string
  chartData?: { labels: string[], values: number[] }
  type?: 'text' | 'chart'
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Verificar login ao carregar
  useEffect(() => {
    const token = localStorage.getItem('comlink_token')
    const user = localStorage.getItem('comlink_usuario')
    
    if (token && user) {
      setIsLoggedIn(true)
      setUserData(JSON.parse(user))
    }
  }, [])

  // Scroll automático no chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogin = (usuario: any) => {
    setIsLoggedIn(true)
    setUserData(usuario)
  }

  const handleLogout = () => {
    localStorage.removeItem('comlink_token')
    localStorage.removeItem('comlink_usuario')
    setIsLoggedIn(false)
    setUserData(null)
    setMessages([])
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        chartData: data.chartData,
        type: data.type || 'text'
      }])
    } catch (error) {
      console.error('Erro:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Se não estiver logado, mostra tela de login
  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={handleLogin}
        onAdminClick={() => setShowAdmin(true)}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        {/* Header Sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  COMLINK
                </h1>
                <p className="text-xs text-slate-400">{userData?.empresa?.nome}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white mx-auto"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>

          <button
            onClick={() => setCurrentPage('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-2 ${
              currentPage === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Analytics</span>}
          </button>

          {/* Botão Admin (só para super_admin) */}
          {userData?.perfil === 'super_admin' && (
            <button
              onClick={() => setShowAdmin(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20"
            >
              <Shield className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Admin</span>}
            </button>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div>
              <p className="text-sm font-semibold text-white">{userData?.nome}</p>
              <p className="text-xs text-slate-400">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  userData?.acesso_ia 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {userData?.acesso_ia ? 'IA Ativa' : 'Sem IA'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                  {userData?.perfil}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-3 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Sair"
            >
              <span className="text-xl">🚪</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentPage === 'dashboard' && (
          <Dashboard
            messages={messages}
            input={input}
            setInput={setInput}
            loading={loading}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
            chatEndRef={chatEndRef}
            inputRef={inputRef}
          />
        )}

        {currentPage === 'analytics' && (
          <Analytics />
        )}
      </div>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  )
}

export default App

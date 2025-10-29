import { useState, useRef, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import AdminPanel from './components/AdminPanel'
import { Menu, X, MessageSquare, BarChart3, Shield, LogOut } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  chartData?: { labels: string[], values: number[] }
  type?: 'text' | 'chart'
}

interface UserData {
  id: number
  nome: string
  email: string
  fornecedor: string
  cargo?: string
  perfil: string
  acesso_ia: boolean
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll automático para última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogin = (user: UserData) => {
    setUserData(user)
    setIsLoggedIn(true)
    
    // Mensagem de boas-vindas
    setMessages([
      {
        role: 'assistant',
        content: `Olá, ${user.nome}! 👋\n\nSou a COMLINK IA, sua assistente para gestão de cotações.\n\nPosso ajudar você com:\n• 📊 Análise de cotações recebidas\n• 📈 Estatísticas e métricas\n• 🔍 Busca de informações específicas\n• 💡 Insights sobre oportunidades\n\nComo posso ajudar você hoje?`,
        type: 'text'
      }
    ])
  }

  const handleLogout = () => {
    localStorage.removeItem('comlink_user')
    setIsLoggedIn(false)
    setUserData(null)
    setMessages([])
    setInput('')
    setCurrentPage('dashboard')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId: userData?.id,
          history: messages.slice(-10)
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          chartData: data.chartData,
          type: data.chartData ? 'chart' : 'text'
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem')
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={handleLogin} 
        onAdminClick={() => setShowAdmin(true)}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 relative z-10 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-xl font-bold text-white">JM</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">COMLINK</h1>
                <p className="text-xs text-cyan-400">Portal IA</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-xl font-bold text-white">JM</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Chat IA</span>}
          </button>

          <button
            onClick={() => setCurrentPage('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Analytics</span>}
          </button>

          {userData?.perfil === 'admin' && (
            <button
              onClick={() => setShowAdmin(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-500/10 border border-purple-500/20 transition-all"
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

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all"
        >
          {sidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
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

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, BarChart3, Shield, Menu, X, LogOut } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'

const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

interface Message {
  role: 'user' | 'assistant'
  content: string
  chart?: string
  type?: 'text' | 'chart'
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'admin'>('dashboard')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentPage === 'dashboard') {
      inputRef.current?.focus()
    }
  }, [currentPage])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setMessages([])
    setCurrentPage('dashboard')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, type: 'text' }])
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()
      const assistantMessage = data.message || data.response || 'Sem resposta'
      
      // Se tiver gráfico, adicionar ao estado
      if (data.type === 'chart' && data.chart) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: assistantMessage,
          chart: data.chart,
          type: 'chart'
        }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: assistantMessage,
          type: 'text'
        }])
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        type: 'text'
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-cyan-500/30">
              <img src="/logo.png" alt="COMLINK" className="h-32 w-auto" />
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-cyan-500/20">
            <p className="text-xs text-slate-400 mb-1">Fornecedor</p>
            <p className="text-sm font-semibold text-cyan-400">JM TECNOLOGIA</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat IA</span>
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
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => setCurrentPage('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Painel Admin</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6 text-slate-300" /> : <Menu className="w-6 h-6 text-slate-300" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Portal do Fornecedor</h1>
                <p className="text-xs text-slate-400">Gestão de Cotações Recebidas</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
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
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'admin' && <AdminPanel />}
        </main>
      </div>
    </div>
  )
}

export default App

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, BarChart3, Shield, Menu, X, LogOut, Building2 } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'

const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

interface Message {
  role: 'user' | 'assistant'
  content: string
  chartData?: { labels: string[], values: number[] }
  type?: 'text' | 'chart'
}

interface Empresa {
  id: number
  cod: string
  razao_social: string
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'admin'>('dashboard')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('')

  const isSuperAdmin = userData?.perfil === 'super_admin'

  // ===================================
  // 🔍 DEBUG: MONITORAR empresaSelecionada
  // ===================================
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🏢 EMPRESA SELECIONADA MUDOU!')
    console.log('📦 Valor atual:', empresaSelecionada)
    console.log('✅ Válido?', empresaSelecionada !== undefined && empresaSelecionada !== null ? 'SIM' : '❌ NÃO - VAZIO!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }, [empresaSelecionada])

  // Verificar login ao carregar
  useEffect(() => {
    console.log('🔄 Verificando login salvo...')
    const savedUser = localStorage.getItem('comlink_user')
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('✅ USUÁRIO ENCONTRADO NO LOCALSTORAGE')
        console.log('📦 Dados completos:', user)
        console.log('👤 Nome:', user.nome_completo)
        console.log('🏢 Empresa COD:', user.empresa_cod)
        console.log('🏢 Empresa Nome:', user.empresa_nome)
        console.log('👔 Perfil:', user.perfil)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        setUserData(user)
        setIsLoggedIn(true)
        
        if (user.perfil === 'super_admin') {
          console.log('👑 Super Admin detectado - carregando empresas...')
          carregarEmpresas()
        } else {
          // ✅ CORREÇÃO: Garantir que COD seja string, mesmo se for "0"
          const empresaCod = user.empresa_cod !== undefined && user.empresa_cod !== null ? String(user.empresa_cod) : ''
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('🎯 DEFININDO EMPRESA SELECIONADA')
          console.log('📥 Valor recebido:', user.empresa_cod)
          console.log('✅ Valor definido:', empresaCod)
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          setEmpresaSelecionada(empresaCod)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error)
        localStorage.removeItem('comlink_user')
      }
    } else {
      console.log('⚠️ Nenhum usuário salvo no localStorage')
    }
  }, [])

  const carregarEmpresas = async () => {
    try {
      console.log('📡 Carregando lista de empresas...')
      const response = await fetch(`${API_URL}/admin/empresas`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      // ✅ VALIDAÇÃO: Garantir que data é array
      if (!Array.isArray(data)) {
        console.error('❌ API retornou formato inválido:', data)
        setEmpresas([])
        return
      }
      
      console.log('✅ Empresas carregadas:', data)
      setEmpresas(data)
      
      if (data.length > 0) {
        console.log('🎯 Selecionando primeira empresa:', data[0].cod)
        setEmpresaSelecionada(String(data[0].cod))
      }
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error)
      setEmpresas([])
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentPage === 'dashboard') {
      inputRef.current?.focus()
    }
  }, [currentPage])

  const handleLogin = (user: any) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔐 LOGIN REALIZADO COM SUCESSO!')
    console.log('📦 Dados do usuário:', user)
    console.log('🏢 empresa_cod:', user.empresa_cod)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    setUserData(user)
    setIsLoggedIn(true)
    
    if (user.perfil === 'super_admin') {
      console.log('👑 Super Admin - carregando empresas...')
      carregarEmpresas()
    } else {
      // ✅ CORREÇÃO: Garantir que COD seja string, mesmo se for "0"
      const empresaCod = user.empresa_cod !== undefined && user.empresa_cod !== null ? String(user.empresa_cod) : ''
      console.log('🎯 Definindo empresa:', empresaCod)
      setEmpresaSelecionada(empresaCod)
    }
  }

  const handleLogout = () => {
    console.log('👋 Logout realizado')
    localStorage.removeItem('user')
    localStorage.removeItem('comlink_user')
    setUserData(null)
    setIsLoggedIn(false)
    setMessages([])
    setCurrentPage('dashboard')
    setEmpresaSelecionada('')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, type: 'text' }])
    setLoading(true)

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📤 ENVIANDO MENSAGEM PARA IA')
    console.log('💬 Mensagem:', userMessage)
    console.log('🏢 empresaCod enviado:', empresaSelecionada)
    console.log('❓ empresaCod vazio?', empresaSelecionada === '' ? '⚠️ SIM' : '✅ NÃO')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    try {
      const payload = { 
        message: userMessage,
        empresaCod: empresaSelecionada
      }
      
      console.log('📦 Payload completo:', JSON.stringify(payload, null, 2))

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('❌ Erro HTTP:', response.status, response.statusText)
        throw new Error('Erro na API')
      }

      const data = await response.json()
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📥 RESPOSTA DA IA RECEBIDA')
      console.log('📦 Dados:', data)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      const assistantMessage = data.message || data.response || 'Sem resposta'
      
      if (data.type === 'chart' && data.chartData) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: assistantMessage,
          chartData: data.chartData,
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
      console.error('❌ ERRO AO ENVIAR MENSAGEM:', error)
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
    return <Login onLogin={handleLogin} onAdminClick={() => setCurrentPage('admin')} />
  }

  // ✅ CORREÇÃO: Validar se empresas é array antes de usar .find()
  const empresaNome = isSuperAdmin 
    ? (Array.isArray(empresas) ? empresas.find(e => e.cod === empresaSelecionada)?.razao_social : null) || 'Selecione uma empresa'
    : userData?.empresa_nome || 'JM TECNOLOGIA'

  console.log('🏷️ Nome da empresa exibido:', empresaNome)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-slate-900/70 backdrop-blur-2xl border-r border-slate-800/50 overflow-hidden relative z-10`}>
        <div className="p-6">
          <div className="mb-8 p-5 bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">
                  {empresaNome.substring(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-semibold">
                  {isSuperAdmin ? 'Visualizando' : 'Fornecedor'}
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {empresaNome}
                </p>
              </div>
            </div>
            <div className="pl-1">
              <p className="text-xs text-slate-500 mb-1">{userData?.nome_completo || 'Usuário'}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  userData?.perfil === 'super_admin' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {userData?.perfil === 'super_admin' ? 'Super Admin' : 'Consultor'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </div>
          </div>

          {isSuperAdmin && Array.isArray(empresas) && empresas.length > 0 && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <label className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa Ativa
              </label>
              <select
                value={empresaSelecionada}
                onChange={(e) => {
                  console.log('🔄 Mudando empresa para:', e.target.value)
                  setEmpresaSelecionada(e.target.value)
                }}
                className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.cod}>
                    {emp.razao_social} ({emp.cod})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Métricas e dados desta empresa
              </p>
            </div>
          )}

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all group ${
                currentPage === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <MessageCircle className={`w-5 h-5 ${currentPage === 'dashboard' ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-semibold">Chat IA</span>
            </button>

            <button
              onClick={() => setCurrentPage('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all group ${
                currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className={`w-5 h-5 ${currentPage === 'analytics' ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-semibold">Analytics</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all group ${
                  currentPage === 'admin'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Shield className={`w-5 h-5 ${currentPage === 'admin' ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-semibold">Painel Admin</span>
              </button>
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20 hover:border-red-500/40 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Sair</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <header className="bg-slate-900/70 backdrop-blur-2xl border-b border-slate-800/50 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors group"
              >
                {sidebarOpen ? 
                  <X className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:rotate-90 transition-all" /> : 
                  <Menu className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all" />
                }
              </button>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Portal do Fornecedor
                </h1>
                <p className="text-xs text-slate-400">Gestão Inteligente de Cotações</p>
              </div>
            </div>

            {empresaSelecionada !== '' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">
                  <span className="text-slate-500">COD:</span> {empresaSelecionada}
                </span>
              </div>
            )}
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
          {currentPage === 'analytics' && (
            <>
              {console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
              {console.log('📊 RENDERIZANDO ANALYTICS')}
              {console.log('🏢 empresaCod passado:', empresaSelecionada)}
              {console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
              <Analytics empresaCod={empresaSelecionada} />
            </>
          )}
          {currentPage === 'admin' && isSuperAdmin && (
            <AdminPanel onClose={() => setCurrentPage('dashboard')} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

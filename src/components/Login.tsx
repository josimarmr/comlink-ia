import { useState, useEffect } from 'react'
import { Lock, Mail, Eye, EyeOff, Settings, Building2 } from 'lucide-react'

interface LoginProps {
  onLogin: (userData: any) => void
  onAdminClick: () => void
}

export default function Login({ onLogin, onAdminClick }: LoginProps) {
  const [cod, setCod] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRegister, setShowRegister] = useState(false)

  // Formulário de cadastro
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cod: '',
    fornecedor: '',
    cargo: ''
  })

  // Verificar se já tem login salvo
  useEffect(() => {
    const savedUser = localStorage.getItem('comlink_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      onLogin(userData)
    }
  }, [onLogin])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod, email, senha })
      })

      const data = await response.json()

      if (data.sucesso) {
        // Salvar no localStorage
        localStorage.setItem('comlink_user', JSON.stringify(data.usuario))
        onLogin(data.usuario)
      } else {
        setError(data.mensagem || 'COD, email ou senha inválidos')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (registerData.senha !== registerData.confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (registerData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: registerData.nome,
          email: registerData.email,
          senha: registerData.senha,
          cod: registerData.cod,
          fornecedor: registerData.fornecedor,
          cargo: registerData.cargo
        })
      })

      const data = await response.json()

      if (data.sucesso) {
        alert('✅ Usuário cadastrado com sucesso! Faça login para continuar.')
        setShowRegister(false)
        setRegisterData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          cod: '',
          fornecedor: '',
          cargo: ''
        })
      } else {
        setError(data.mensagem || 'Erro ao cadastrar usuário')
      }
    } catch (err) {
      setError('Erro ao cadastrar. Tente novamente.')
      console.error('Erro no cadastro:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-xl shadow-cyan-500/50">
            <span className="text-3xl font-bold text-white">JM</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            COMLINK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">IA</span>
          </h1>
          <p className="text-slate-400">Portal do Fornecedor Inteligente</p>
        </div>

        {/* Login / Register Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-slideUp">
          {!showRegister ? (
            /* FORMULÁRIO DE LOGIN */
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Código da Empresa
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={cod}
                    onChange={(e) => setCod(e.target.value.toLowerCase())}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Ex: jm234"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              {/* Botões Inferiores */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="flex-1 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 hover:border-cyan-500/50 transition-all"
                >
                  Cadastre-se
                </button>

                <button
                  type="button"
                  onClick={onAdminClick}
                  className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-2"
                  title="Configurações Administrativas"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            /* FORMULÁRIO DE CADASTRO */
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Novo Usuário</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={registerData.nome}
                  onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="joao@fornecedor.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Código da Empresa</label>
                  <input
                    type="text"
                    value={registerData.cod}
                    onChange={(e) => setRegisterData({ ...registerData, cod: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="jm234"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fornecedor</label>
                  <input
                    type="text"
                    value={registerData.fornecedor}
                    onChange={(e) => setRegisterData({ ...registerData, fornecedor: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Empresa XYZ"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cargo</label>
                <input
                  type="text"
                  value={registerData.cargo}
                  onChange={(e) => setRegisterData({ ...registerData, cargo: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Gerente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                <input
                  type="password"
                  value={registerData.senha}
                  onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  value={registerData.confirmarSenha}
                  onChange={(e) => setRegisterData({ ...registerData, confirmarSenha: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false)
                    setError('')
                  }}
                  className="flex-1 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-all"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Credenciais de Teste */}
        {!showRegister && (
          <div className="mt-6 p-4 bg-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="text-slate-400 text-xs text-center mb-3 font-semibold">🔐 Credenciais de Teste</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                <span className="text-slate-400 text-sm">COD:</span>
                <span className="text-cyan-400 font-mono text-sm">jm234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                <span className="text-slate-400 text-sm">Email:</span>
                <span className="text-cyan-400 font-mono text-sm">mariano@easycomlink.com</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                <span className="text-slate-400 text-sm">Senha:</span>
                <span className="text-cyan-400 font-mono text-sm font-bold">easy2025</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-500 text-sm">Sistema de Gestão de Cotações Inteligente</p>
          <p className="text-slate-600 text-xs mt-1">© 2025 COMLINK - Powered by AI</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-shake { animation: shake 0.3s ease-out; }
      `}</style>
    </div>
  )
}

import { useState } from 'react'
import { LogIn, Lock, User, Building2, AlertCircle, Settings } from 'lucide-react'

export default function Login({ onLogin, onAdminClick }) {
  const [cod, setCod] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      if (!cod || !email || !senha) {
        setError('Preencha todos os campos')
        setLoading(false)
        return
      }

      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod, email, senha })
      })

      const data = await response.json()

      if (data.sucesso) {
        localStorage.setItem('comlink_token', data.token)
        localStorage.setItem('comlink_usuario', JSON.stringify(data.usuario))
        
        if (onLogin) {
          onLogin(data.usuario)
        }
      } else {
        setError(data.mensagem || 'Erro ao fazer login')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
                COMLINK
              </h1>
              <p className="text-slate-400 mt-2 text-sm text-center">Portal de Cotações</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h2>
            <p className="text-slate-400 text-sm">Entre com suas credenciais</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Campo COD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Código da Empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={cod}
                  onChange={(e) => setCod(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium uppercase"
                  placeholder="Ex: JM234"
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Botão de Login */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative z-10">Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Entrar no Sistema</span>
                </>
              )}
            </button>

            {/* Botão Admin */}
            <button
              onClick={onAdminClick}
              className="w-full py-3 text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Settings className="w-4 h-4" />
              Configurações Administrativas
            </button>
          </div>

          {/* Credenciais de Teste */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-5">
              <p className="text-xs font-semibold text-blue-400 text-center mb-3">
                🧪 Credenciais de Teste
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span>COD:</span>
                  <span className="text-cyan-400 font-mono">JM234</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span>Email:</span>
                  <span className="text-cyan-400 font-mono text-xs">josimar.silva@jmtecnologia.com.br</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span>Senha:</span>
                  <span className="text-cyan-400 font-mono">Senha123!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© 2025 COMLINK - Sistema de Cotações</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

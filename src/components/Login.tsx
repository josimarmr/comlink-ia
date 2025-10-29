import { useState } from 'react'
import { LogIn, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      if (!usuario || !senha) {
        setError('Preencha todos os campos')
        setLoading(false)
        return
      }

      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario.trim().toUpperCase(),
          senha: senha
        })
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
      setError('Erro ao conectar com o servidor. Tente novamente.')
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
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fadeIn">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  COMLINK
                </h1>
                <p className="text-slate-400 mt-2 text-sm">Portal de Cotações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h2>
            <p className="text-slate-400 text-sm">Entre com suas credenciais</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Campo Usuário */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium uppercase"
                  placeholder="CLK.NOME.SOBRENOME"
                  autoComplete="username"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Exemplo: CLK.JOSIMAR.SILVA
              </p>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 animate-shake">
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
          </div>

          {/* Info de Acesso */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-5 space-y-3">
              <p className="text-sm font-semibold text-slate-300 text-center mb-3 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Estrutura de Acesso
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <div>
                    <strong className="text-slate-300">USUARIO:</strong> Formato CLK.NOME.SOBRENOME
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <div>
                    <strong className="text-slate-300">Primeira letra maiúscula:</strong> Nome e sobrenome
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <div>
                    <strong className="text-slate-300">Acesso IA:</strong> Apenas usuários autorizados
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credenciais de Teste */}
          <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl">
            <p className="text-xs font-semibold text-blue-400 text-center mb-2">
              🧪 Credenciais de Teste
            </p>
            <div className="space-y-1 text-xs text-slate-400 text-center">
              <p><strong className="text-slate-300">Usuário:</strong> CLK.JOSIMAR.SILVA</p>
              <p><strong className="text-slate-300">Senha:</strong> Senha123!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© 2025 COMLINK - JM TECNOLOGIA</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

import { useState } from 'react'
import { LogIn, Puzzle, Lock, User, UserPlus } from 'lucide-react'

interface LoginProps {
  onLogin: (userData: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCadastro, setShowCadastro] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulação - depois conectar com API real
    if (email === 'admin@jmtecnologia.com' && senha === '123456') {
      const userData = {
        id: 1,
        nome: 'Administrador',
        email: email,
        fornecedor: 'JM TECNOLOGIA',
        cargo: 'Administrador'
      }
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      onLogin(userData)
    } else {
      setError('Email ou senha incorretos!')
      setLoading(false)
    }
  }

  if (showCadastro) {
    return <CadastroUsuario onVoltar={() => setShowCadastro(false)} />
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
        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
              <Puzzle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Portal do Fornecedor
            </h1>
            <p className="text-slate-400">
              Faça login para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all font-medium"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 animate-shake">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70"
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
          </form>

          {/* Link Cadastro */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowCadastro(true)}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Não tem conta? Cadastre-se
            </button>
          </div>

          {/* Credenciais de Teste */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-5 space-y-3">
              <p className="text-sm font-semibold text-slate-300 text-center mb-3">
                🔐 Credenciais de Teste
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                  <span className="text-slate-400 text-sm">Email:</span>
                  <span className="text-cyan-400 font-mono text-sm font-bold">admin@jmtecnologia.com</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                  <span className="text-slate-400 text-sm">Senha:</span>
                  <span className="text-cyan-400 font-mono text-sm font-bold">123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-500 text-sm">
            Sistema de Gestão de Cotações Inteligente
          </p>
          <p className="text-slate-600 text-xs mt-1">
            © 2025 COMLINK - Powered by AI
          </p>
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

// Componente de Cadastro
function CadastroUsuario({ onVoltar }: { onVoltar: () => void }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] = useState('')

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Conectar com API
    alert('Cadastro realizado! (aguardando integração com API)')
    onVoltar()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6 text-center">
            Cadastro de Usuário
          </h2>
          
          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Cargo</label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                placeholder="Ex: Gerente Comercial"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onVoltar}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl transition-all"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

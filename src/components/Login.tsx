import { useState } from 'react'
import { LogIn } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [fornecedor, setFornecedor] = useState('JM TECNOLOGIA')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (fornecedor === 'JM TECNOLOGIA' && senha === '123456') {
      onLogin()
    } else {
      setError('Credenciais inválidas! Verifique o fornecedor e senha.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo Grande */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-cyan-500/30">
            <img 
              src="/logo.png" 
              alt="COMLINK" 
              className="h-48 w-auto"
            />
          </div>
        </div>

        {/* Card de Login */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Portal do Fornecedor
            </h1>
            <p className="text-slate-400 text-sm">
              Acesse para gerenciar suas cotações recebidas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Fornecedor */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fornecedor
              </label>
              <input
                type="text"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                placeholder="Nome do fornecedor"
                readOnly
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                placeholder="Digite sua senha"
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Entrar no Sistema
            </button>
          </form>

          {/* Orientações */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 text-center">
              📋 Credenciais de Acesso
            </h3>
            <div className="bg-slate-800/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Fornecedor:</span>
                <span className="text-cyan-400 font-mono text-sm font-semibold">JM TECNOLOGIA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Senha:</span>
                <span className="text-cyan-400 font-mono text-sm font-semibold">123456</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs text-center mt-4">
              💡 Use as credenciais acima para acessar o sistema
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Sistema de Gestão de Cotações
          </p>
          <p className="text-slate-600 text-xs mt-1">
            © 2025 COMLINK - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}


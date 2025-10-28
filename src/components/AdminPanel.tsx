import { useState } from 'react'
import { Lock, Database, Play, Loader2 } from 'lucide-react'

const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'
const ADMIN_PASSWORD = 'josimar13051987'

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [sqlQuery, setSqlQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Senha incorreta!')
    }
  }

  const executeQuery = async (query?: string) => {
    const queryToExecute = query || sqlQuery
    if (!queryToExecute.trim()) return

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch(`${API_URL}/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToExecute })
      })

      if (!response.ok) throw new Error('Erro ao executar consulta')

      const data = await response.json()
      setResults(data.results)
    } catch (err: any) {
      setError(err.message || 'Erro ao executar consulta')
    } finally {
      setLoading(false)
    }
  }

  const quickQueries = [
    { label: '🔢 Contar Cotações', query: 'SELECT COUNT(*) as total FROM quotations' },
    { label: '👥 Contar Fornecedores', query: 'SELECT COUNT(*) as total FROM suppliers' },
    { label: '📊 Ver Usuários', query: 'SELECT * FROM users LIMIT 10' },
    { label: '📋 Listar Tabelas', query: "SELECT name FROM sqlite_master WHERE type='table'" },
    { label: '📈 Últimas Cotações', query: 'SELECT * FROM quotations ORDER BY id DESC LIMIT 5' },
    { label: '🎯 Planos Banner', query: 'SELECT * FROM banner_plans' }
  ]

  if (!authenticated) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-200 text-center mb-6">
            Painel Administrativo
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Digite a senha"
              className="w-full bg-slate-900/50 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl px-6 py-3 transition-all shadow-lg shadow-cyan-500/30"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-slate-200">Painel Administrativo</h2>
              <p className="text-slate-400">Gerenciamento do banco de dados</p>
            </div>
          </div>
        </div>

        {/* Quick Queries */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-200 mb-4">Consultas Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => executeQuery(item.query)}
                disabled={loading}
                className="bg-slate-900/50 hover:bg-slate-900/70 text-slate-200 rounded-xl px-4 py-3 transition-all border border-slate-700/50 hover:border-cyan-500/50 disabled:opacity-50 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Query */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-200 mb-4">Consulta SQL Personalizada</h3>
          <div className="space-y-4">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Digite sua consulta SQL aqui..."
              rows={4}
              className="w-full bg-slate-900/50 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm"
            />
            <button
              onClick={() => executeQuery()}
              disabled={loading || !sqlQuery.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Executar Consulta
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-200 mb-4">
              Resultados ({Array.isArray(results) ? results.length : 0} registros)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    {results.length > 0 &&
                      Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left px-4 py-3 text-slate-300 font-medium">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-900/30">
                      {Object.values(row).map((value: any, cellIdx: number) => (
                        <td key={cellIdx} className="px-4 py-3 text-slate-400">
                          {value !== null ? String(value) : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


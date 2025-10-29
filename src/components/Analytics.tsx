import { useState, useEffect } from 'react'
import { TrendingUp, Users, FileText, Clock, RefreshCw } from 'lucide-react'

interface AnalyticsProps {
  empresaCod: string
}

interface Stats {
  total_quotations: number
  quotations_with_response: number
  quotations_refused: number
  total_suppliers: number
}

export default function Analytics({ empresaCod }: AnalyticsProps) {
  const [stats, setStats] = useState<Stats>({
    total_quotations: 0,
    quotations_with_response: 0,
    quotations_refused: 0,
    total_suppliers: 0
  })
  const [loading, setLoading] = useState(false)

  const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

  useEffect(() => {
    if (empresaCod) {
      carregarStats()
    }
  }, [empresaCod])

  const carregarStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/stats?empresa_cod=${empresaCod}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const taxaResposta = stats.total_quotations > 0 
    ? Math.round((stats.quotations_with_response / stats.total_quotations) * 100) 
    : 0

  const pendentes = stats.total_quotations - stats.quotations_with_response - stats.quotations_refused

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Analytics
          </h2>
          <p className="text-slate-400">Métricas e indicadores de performance</p>
        </div>
        <button
          onClick={carregarStats}
          disabled={loading}
          className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Cotações */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-all">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-slate-500 font-semibold">TOTAL</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2">
            {stats.total_quotations}
          </h3>
          <p className="text-slate-400 text-sm">Cotações recebidas</p>
        </div>

        {/* Taxa de Resposta */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-all">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-slate-500 font-semibold">TAXA</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2">
            {taxaResposta}%
          </h3>
          <p className="text-slate-400 text-sm">Taxa de resposta</p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${taxaResposta}%` }}
            />
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-all">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-slate-500 font-semibold">AGUARDANDO</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2">
            {pendentes}
          </h3>
          <p className="text-slate-400 text-sm">Cotações pendentes</p>
        </div>

        {/* Fornecedores */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-all">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-slate-500 font-semibold">PARCEIROS</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2">
            {stats.total_suppliers}
          </h3>
          <p className="text-slate-400 text-sm">Fornecedores ativos</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Status das Cotações</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Respondidas</span>
                <span className="text-green-400 font-bold">{stats.quotations_with_response}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  style={{ 
                    width: `${stats.total_quotations > 0 ? (stats.quotations_with_response / stats.total_quotations) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Pendentes</span>
                <span className="text-yellow-400 font-bold">{pendentes}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full"
                  style={{ 
                    width: `${stats.total_quotations > 0 ? (pendentes / stats.total_quotations) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Recusadas</span>
                <span className="text-red-400 font-bold">{stats.quotations_refused}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full"
                  style={{ 
                    width: `${stats.total_quotations > 0 ? (stats.quotations_refused / stats.total_quotations) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Indicadores de Performance</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-slate-400 text-sm mb-1">Média de Resposta</p>
                <p className="text-2xl font-bold text-white">2.4h</p>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-slate-400 text-sm mb-1">Satisfação do Cliente</p>
                <p className="text-2xl font-bold text-white">4.8/5</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-slate-400 text-sm mb-1">Valor Médio</p>
                <p className="text-2xl font-bold text-white">R$ 12.5k</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, FileText, Zap } from 'lucide-react'

const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

export default function Analytics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  // Dados para os gráficos
  const statusData = [
    { name: 'Respondidas', value: stats?.quotations_with_response || 0 },
    { name: 'Pendentes', value: (stats?.total_quotations || 0) - (stats?.quotations_with_response || 0) }
  ]

  const monthlyData = [
    { month: 'Jan', cotacoes: 3 },
    { month: 'Fev', cotacoes: 4 },
    { month: 'Mar', cotacoes: 5 },
    { month: 'Abr', cotacoes: 2 },
    { month: 'Mai', cotacoes: 4 },
    { month: 'Jun', cotacoes: 4 }
  ]

  const trendData = [
    { dia: '1', taxa: 65 },
    { dia: '2', taxa: 68 },
    { dia: '3', taxa: 70 },
    { dia: '4', taxa: 72 },
    { dia: '5', taxa: 73 }
  ]

  const supplierData = [
    { name: 'Fornecedor A', cotacoes: 8 },
    { name: 'Fornecedor B', cotacoes: 6 },
    { name: 'Fornecedor C', cotacoes: 4 },
    { name: 'Fornecedor D', cotacoes: 3 },
    { name: 'Fornecedor E', cotacoes: 1 }
  ]

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-cyan-400" />
              <span className="text-3xl font-bold text-cyan-400">{stats?.total_quotations || 0}</span>
            </div>
            <h3 className="text-slate-300 font-medium">Total de Cotações</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-blue-400">{stats?.total_suppliers || 0}</span>
            </div>
            <h3 className="text-slate-300 font-medium">Fornecedores</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">{stats?.response_rate || 0}%</span>
            </div>
            <h3 className="text-slate-300 font-medium">Taxa de Resposta</h3>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-pink-400" />
              <span className="text-3xl font-bold text-pink-400">{stats?.total_banner_plans || 0}</span>
            </div>
            <h3 className="text-slate-300 font-medium">Planos Banner</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Status das Cotações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Cotações por Fornecedor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Bar dataKey="cotacoes" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Monthly */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Cotações Mensais</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="cotacoes" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Trend */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Tendência de Taxa de Resposta</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dia" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="taxa" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export default function Analytics({ empresaCod }) {
  const [stats, setStats] = useState({
    total_quotations: 0,
    quotations_with_response: 0,
    quotations_refused: 0,
    clientes_atendidos: 0,
    taxa_conversao: 0,
    ticket_medio: 0,
    valor_total_faturado: 0
  });
  const [loading, setLoading] = useState(false);
  
  const API_URL = "https://comlink-api.josimarmarianocel.workers.dev";

  useEffect(() => {
    if (empresaCod) {
      loadStats();
    }
  }, [empresaCod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/stats?empresa_cod=${empresaCod}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const taxaResposta = stats.total_quotations > 0 
    ? Math.round((stats.quotations_with_response / stats.total_quotations) * 100)
    : 0;

  const cotacoesPendentes = stats.total_quotations - stats.quotations_with_response - stats.quotations_refused;

  // Formatar valores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Analytics</h1>
          <p className="text-gray-400 mt-1">Métricas e indicadores de performance</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Cotações */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {stats.total_quotations}
          </div>
          <p className="text-sm text-gray-400">Cotações recebidas</p>
        </div>

        {/* Taxa de Resposta */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Taxa</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {taxaResposta}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${taxaResposta}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">Taxa de resposta</p>
        </div>

        {/* Cotações Aguardando */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Aguardando</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {cotacoesPendentes}
          </div>
          <p className="text-sm text-gray-400">Cotações pendentes</p>
        </div>

        {/* Clientes Atendidos */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Clientes</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {stats.clientes_atendidos}
          </div>
          <p className="text-sm text-gray-400">Clientes atendidos</p>
        </div>
      </div>

      {/* Seção Dividida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status das Cotações */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Status das Cotações</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Respondidas</span>
              <span className="text-2xl font-bold text-green-400">
                {stats.quotations_with_response}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Pendentes</span>
              <span className="text-2xl font-bold text-yellow-400">
                {cotacoesPendentes}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Recusadas</span>
              <span className="text-2xl font-bold text-red-400">
                {stats.quotations_refused}
              </span>
            </div>
          </div>
        </div>

        {/* Indicadores de Performance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Indicadores de Performance</h2>
          <div className="space-y-6">
            {/* Taxa de Conversão */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-gray-400">Taxa de Conversão</span>
                  <span className="text-2xl font-bold text-white">{stats.taxa_conversao}%</span>
                </div>
                <p className="text-xs text-gray-500">Cotações que viraram pedidos</p>
              </div>
            </div>

            {/* Ticket Médio */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-gray-400">Ticket Médio</span>
                  <span className="text-2xl font-bold text-white">
                    {formatCurrency(stats.ticket_medio)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Valor médio dos pedidos</p>
              </div>
            </div>

            {/* Valor Total Faturado */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-gray-400">Faturamento Total</span>
                  <span className="text-2xl font-bold text-white">
                    {formatCurrency(stats.valor_total_faturado)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Soma de pedidos e serviços</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';

export default function Analytics({ empresaCod }) {
  // 🔍 LOG 1: Ver se recebe empresaCod
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RENDERIZANDO ANALYTICS');
  console.log('🏢 empresaCod passado:', empresaCod);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const [stats, setStats] = useState({
    // COTAÇÕES
    total_cotacoes: 0,
    cotacoes_respondidas: 0,
    cotacoes_pendentes: 0,
    cotacoes_recusadas: 0,
    cotacoes_finalizadas: 0,
    
    // PEDIDOS
    total_pedidos: 0,
    pedidos_confirmados: 0,
    pedidos_pendentes: 0,
    pedidos_cancelados: 0,
    
    // VALORES
    valor_total_pedidos: 0,
    ticket_medio: 0,
    
    // COMPRADORES ✅ ATUALIZADO
    compradores_atendidos: 0,
    
    // SERVIÇOS
    total_servicos: 0,
    valor_total_servicos: 0
  });
  
  const [loading, setLoading] = useState(false);
  
  const API_URL = "https://comlink-api.josimarmarianocel.workers.dev";

  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 useEffect disparado');
    console.log('🏢 empresaCod atual:', empresaCod);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (empresaCod) {
      loadStats();
    } else {
      console.error('❌ empresaCod está vazio!');
    }
  }, [empresaCod]);

  const loadStats = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 CHAMANDO API /stats');
    console.log('🏢 empresaCod enviado:', empresaCod);
    console.log('🔗 URL:', `${API_URL}/stats?empresa_cod=${empresaCod}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/stats?empresa_cod=${empresaCod}`);
      
      console.log('📥 Resposta recebida:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        setStats(data);
      } else {
        console.error('❌ Erro na resposta:', response.status);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos derivados
  const taxaResposta = stats.total_cotacoes > 0 
    ? Math.round((stats.cotacoes_respondidas / stats.total_cotacoes) * 100)
    : 0;

  const faturamentoTotal = stats.valor_total_pedidos + stats.valor_total_servicos;

  // Formatação
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Completo
          </h1>
          <p className="text-gray-400 mt-2">Todas as métricas e indicadores de performance</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {/* ========== SEÇÃO COTAÇÕES ========== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Cotações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.total_cotacoes}
            </div>
            <p className="text-xs text-gray-400">Cotações recebidas</p>
          </div>

          {/* Respondidas */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Respondidas</span>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats.cotacoes_respondidas}
            </div>
            <p className="text-xs text-gray-400">Com resposta enviada</p>
          </div>

          {/* Pendentes */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Pendentes</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {stats.cotacoes_pendentes}
            </div>
            <p className="text-xs text-gray-400">Aguardando resposta</p>
          </div>

          {/* Recusadas */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Recusadas</span>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">
              {stats.cotacoes_recusadas}
            </div>
            <p className="text-xs text-gray-400">Recusadas/Declinadas</p>
          </div>

          {/* Finalizadas */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Finalizadas</span>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {stats.cotacoes_finalizadas}
            </div>
            <p className="text-xs text-gray-400">Concluídas</p>
          </div>
        </div>
      </div>

      {/* ========== SEÇÃO PEDIDOS ========== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-purple-400" />
          Pedidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Pedidos */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.total_pedidos}
            </div>
            <p className="text-xs text-gray-400">Pedidos gerados</p>
          </div>

          {/* Confirmados */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Confirmados</span>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats.pedidos_confirmados}
            </div>
            <p className="text-xs text-gray-400">Pedidos confirmados</p>
          </div>

          {/* Pendentes */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Pendentes</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {stats.pedidos_pendentes}
            </div>
            <p className="text-xs text-gray-400">Aguardando confirmação</p>
          </div>

          {/* Cancelados */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Cancelados</span>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">
              {stats.pedidos_cancelados}
            </div>
            <p className="text-xs text-gray-400">Pedidos cancelados</p>
          </div>
        </div>
      </div>

      {/* ========== SEÇÃO VALORES & MÉTRICAS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Taxa de Resposta */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Taxa de Resposta</h3>
          <div className="text-5xl font-bold text-white mb-4">
            {taxaResposta}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${taxaResposta}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">
            {stats.cotacoes_respondidas} de {stats.total_cotacoes} cotações respondidas
          </p>
        </div>

        {/* Compradores e Serviços ✅ ATUALIZADO */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-6">👥 Compradores & Serviços</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-gray-300">Compradores Atendidos</span>
              </div>
              <span className="text-3xl font-bold text-white">
                {stats.compradores_atendidos}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-cyan-400" />
                <span className="text-gray-300">Total de Serviços</span>
              </div>
              <span className="text-3xl font-bold text-white">
                {stats.total_servicos}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SEÇÃO FINANCEIRA ========== */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          Valores Financeiros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Valor Total Pedidos */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-gray-300 uppercase tracking-wider">Pedidos</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {formatCurrency(stats.valor_total_pedidos)}
            </div>
            <p className="text-xs text-gray-400">Valor total dos pedidos</p>
          </div>

          {/* Valor Total Serviços */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Package className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-300 uppercase tracking-wider">Serviços</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {formatCurrency(stats.valor_total_servicos)}
            </div>
            <p className="text-xs text-gray-400">Valor total dos serviços</p>
          </div>

          {/* Ticket Médio */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-300 uppercase tracking-wider">Ticket Médio</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency(stats.ticket_medio)}
            </div>
            <p className="text-xs text-gray-400">Valor médio por pedido</p>
          </div>

          {/* Faturamento Total */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-300 uppercase tracking-wider">Faturamento Total</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatCurrency(faturamentoTotal)}
            </div>
            <p className="text-xs text-gray-400">Pedidos + Serviços</p>
          </div>
        </div>
      </div>

      {/* Debug Info (remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-red-900/20 border border-red-700/50 rounded-xl">
          <p className="text-red-400 text-sm font-mono">
            DEBUG: empresaCod = "{empresaCod || 'VAZIO!'}"
          </p>
        </div>
      )}
    </div>
  );
}

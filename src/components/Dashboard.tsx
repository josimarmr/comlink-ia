import { Send, Puzzle, Zap, TrendingUp, Users, FileText, BarChart3 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  chart?: string
  type?: 'text' | 'chart'
}

interface DashboardProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  loading: boolean
  sendMessage: () => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  chatEndRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
}

export default function Dashboard({
  messages,
  input,
  setInput,
  loading,
  sendMessage,
  handleKeyPress,
  chatEndRef,
  inputRef
}: DashboardProps) {
  
  const quickActions = [
    { icon: TrendingUp, text: 'Estatísticas', query: 'Mostre as estatísticas gerais do sistema', gradient: 'from-cyan-500 to-blue-500' },
    { icon: Users, text: 'Clientes', query: 'Liste todos os clientes compradores', gradient: 'from-blue-500 to-purple-500' },
    { icon: FileText, text: 'Cotações', query: 'Mostre as últimas cotações recebidas', gradient: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, text: 'Gráfico', query: 'Crie um gráfico das cotações', gradient: 'from-pink-500 to-orange-500' }
  ]

  const handleQuickAction = (query: string) => {
    setInput(query)
    setTimeout(() => sendMessage(), 50)
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] animate-fadeIn">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                  <div className="relative w-28 h-28 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Puzzle className="w-14 h-14 text-white" />
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  COMLINK IA
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-light mb-2">
                  Inteligência Artificial para Gestão de Cotações
                </p>
                <p className="text-sm text-slate-500">
                  Powered by OpenAI GPT-4 • Tempo real • 100% seguro
                </p>
              </div>

              {/* Quick Actions */}
              <div className="w-full max-w-3xl">
                <p className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Ações Rápidas
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.query)}
                      className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {action.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Puzzle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-6 py-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/70 backdrop-blur-xl text-slate-100 border border-slate-700/50'
                    }`}>
                      {msg.type === 'chart' && msg.chart ? (
                        <div>
                          <p style={{ whiteSpace: 'pre-line' }} className="mb-4 leading-relaxed font-medium">
                            {msg.content}
                          </p>
                          <div dangerouslySetInnerHTML={{ __html: msg.chart }} />
                        </div>
                      ) : (
                        <p style={{ whiteSpace: 'pre-line' }} className="leading-relaxed font-medium">
                          {msg.content}
                        </p>
                      )}
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 ml-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xs text-slate-500">Online • Agora</p>
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600 shadow-lg">
                        <span className="text-xs font-bold text-slate-300">VC</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 justify-start animate-slideUp">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Puzzle className="w-5 h-5 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-sm text-slate-400 font-medium">Processando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Digite sua mensagem... (Shift+Enter para quebra de linha)"
                disabled={loading}
                rows={1}
                className="w-full bg-slate-800/50 backdrop-blur-xl text-slate-100 placeholder-slate-500 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 border border-slate-700/50 resize-none transition-all font-medium"
                style={{ minHeight: '56px', maxHeight: '150px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="group relative overflow-hidden w-14 h-14 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-110 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Send className="w-6 h-6 relative z-10" />
            </button>
          </div>
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
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out backwards; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  )
}

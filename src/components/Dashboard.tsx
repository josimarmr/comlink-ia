import { Send, Loader2 } from 'lucide-react'

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
  return (
    <div className="h-full flex flex-col p-6">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">
                Olá! Sou a COMLINK IA
              </h2>
              <p className="text-slate-400">
                Pergunte sobre cotações, fornecedores ou peça gráficos!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-200 border border-slate-700/50'
              }`}
            >
              {msg.type === 'chart' && msg.chart ? (
                <div>
                  <p style={{ whiteSpace: 'pre-line' }} className="mb-4">{msg.content}</p>
                  <div dangerouslySetInnerHTML={{ __html: msg.chart }} />
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta ou peça um gráfico..."
            disabled={loading}
            className="flex-1 bg-slate-900/50 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 transition-all shadow-lg shadow-cyan-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

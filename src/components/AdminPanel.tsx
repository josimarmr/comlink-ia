import { useState, useEffect } from 'react'
import { X, Building2, Users, Shield, Plus, Save, Loader } from 'lucide-react'

export default function AdminPanel({ onClose }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  
  // Estados das abas
  const [activeTab, setActiveTab] = useState('usuarios')
  const [empresas, setEmpresas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  
  // Estados dos formulários
  const [showNovaEmpresa, setShowNovaEmpresa] = useState(false)
  const [showNovoUsuario, setShowNovoUsuario] = useState(false)
  const [novaEmpresa, setNovaEmpresa] = useState({ cod: '', razao_social: '', cnpj: '' })
  const [novoUsuario, setNovoUsuario] = useState({
    empresa_cod: '',
    email: '',
    nome_completo: '',
    senha: '',
    perfil: 'usuario',
    acesso_ia: false
  })

  const handleAuthLogin = () => {
    setError('')
    setLoading(true)

    // Verificar se é admin (cod 1 + email específico)
    if (email === 'josimar.silva@comlinksa.com' && senha === '*Senha87*') {
      setAuthenticated(true)
      loadData()
    } else {
      setError('Acesso negado. Apenas super admin.')
    }
    
    setLoading(false)
  }

  const loadData = async () => {
    try {
      // Carregar empresas
      const respEmpresas = await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/empresas')
      const dataEmpresas = await respEmpresas.json()
      setEmpresas(dataEmpresas)

      // Carregar usuários
      const respUsuarios = await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios')
      const dataUsuarios = await respUsuarios.json()
      setUsuarios(dataUsuarios)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  const handleCadastrarEmpresa = async () => {
    if (!novaEmpresa.cod || !novaEmpresa.razao_social) {
      alert('Preencha COD e Razão Social')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaEmpresa)
      })

      const data = await response.json()
      
      if (data.sucesso) {
        alert('Empresa cadastrada!')
        setShowNovaEmpresa(false)
        setNovaEmpresa({ cod: '', razao_social: '', cnpj: '' })
        loadData()
      } else {
        alert(data.mensagem)
      }
    } catch (err) {
      alert('Erro ao cadastrar empresa')
    } finally {
      setLoading(false)
    }
  }

  const handleCadastrarUsuario = async () => {
    if (!novoUsuario.empresa_cod || !novoUsuario.email || !novoUsuario.nome_completo || !novoUsuario.senha) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      })

      const data = await response.json()
      
      if (data.sucesso) {
        alert('Usuário cadastrado!')
        setShowNovoUsuario(false)
        setNovoUsuario({
          empresa_cod: '',
          email: '',
          nome_completo: '',
          senha: '',
          perfil: 'usuario',
          acesso_ia: false
        })
        loadData()
      } else {
        alert(data.mensagem)
      }
    } catch (err) {
      alert('Erro ao cadastrar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAcessoIA = async (usuarioId, acessoAtual) => {
    setLoading(true)
    try {
      await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios/acesso-ia', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          acesso_ia: !acessoAtual
        })
      })
      loadData()
    } catch (err) {
      alert('Erro ao atualizar acesso')
    } finally {
      setLoading(false)
    }
  }

  // Tela de autenticação
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Acesso Administrativo
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="admin@comlinksa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Digite a senha"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAuthLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Painel admin autenticado
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Painel Administrativo
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'usuarios'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('empresas')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'empresas'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Empresas
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Tab Usuários */}
          {activeTab === 'usuarios' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Gerenciar Usuários</h3>
                <button
                  onClick={() => setShowNovoUsuario(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Usuário
                </button>
              </div>

              {/* Formulário Novo Usuário */}
              {showNovoUsuario && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4">
                  <h4 className="text-lg font-bold text-white mb-4">Cadastrar Novo Usuário</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">COD Empresa</label>
                      <select
                        value={novoUsuario.empresa_cod}
                        onChange={(e) => setNovoUsuario({...novoUsuario, empresa_cod: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      >
                        <option value="">Selecione...</option>
                        {empresas.map(emp => (
                          <option key={emp.cod} value={emp.cod}>{emp.cod} - {emp.razao_social}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={novoUsuario.nome_completo}
                        onChange={(e) => setNovoUsuario({...novoUsuario, nome_completo: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Senha</label>
                      <input
                        type="password"
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Perfil</label>
                      <select
                        value={novoUsuario.perfil}
                        onChange={(e) => setNovoUsuario({...novoUsuario, perfil: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      >
                        <option value="usuario">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={novoUsuario.acesso_ia}
                          onChange={(e) => setNovoUsuario({...novoUsuario, acesso_ia: e.target.checked})}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Acesso à IA</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleCadastrarUsuario}
                      disabled={loading}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => setShowNovoUsuario(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Usuários */}
              <div className="space-y-2">
                {usuarios.map(usuario => (
                  <div key={usuario.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{usuario.nome_completo}</p>
                      <p className="text-slate-400 text-sm">{usuario.email}</p>
                      <p className="text-slate-500 text-xs">
                        {usuario.empresa_cod} - {usuario.empresa_nome} | Perfil: {usuario.perfil}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usuario.acesso_ia === 1}
                          onChange={() => handleToggleAcessoIA(usuario.id, usuario.acesso_ia === 1)}
                          disabled={loading}
                          className="w-5 h-5"
                        />
                        <span className="text-sm text-slate-300">Acesso IA</span>
                      </label>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        usuario.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Empresas */}
          {activeTab === 'empresas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Gerenciar Empresas</h3>
                <button
                  onClick={() => setShowNovaEmpresa(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Empresa
                </button>
              </div>

              {/* Formulário Nova Empresa */}
              {showNovaEmpresa && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4">
                  <h4 className="text-lg font-bold text-white mb-4">Cadastrar Nova Empresa</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">COD</label>
                      <input
                        type="text"
                        value={novaEmpresa.cod}
                        onChange={(e) => setNovaEmpresa({...novaEmpresa, cod: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white uppercase"
                        placeholder="EX: ABC123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Razão Social</label>
                      <input
                        type="text"
                        value={novaEmpresa.razao_social}
                        onChange={(e) => setNovaEmpresa({...novaEmpresa, razao_social: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">CNPJ (opcional)</label>
                      <input
                        type="text"
                        value={novaEmpresa.cnpj}
                        onChange={(e) => setNovaEmpresa({...novaEmpresa, cnpj: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleCadastrarEmpresa}
                      disabled={loading}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => setShowNovaEmpresa(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Empresas */}
              <div className="space-y-2">
                {empresas.map(empresa => (
                  <div key={empresa.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{empresa.razao_social}</p>
                      <p className="text-slate-400 text-sm">COD: {empresa.cod}</p>
                      {empresa.cnpj && <p className="text-slate-500 text-xs">CNPJ: {empresa.cnpj}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">
                        {empresa.total_usuarios} usuário(s)
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        empresa.ativa ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {empresa.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

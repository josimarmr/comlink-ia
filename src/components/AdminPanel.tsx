import { useState, useEffect } from 'react'
import { 
  X, Users, Building2, Search, Edit2, Trash2, 
  Lock, Plus, Save, AlertCircle, CheckCircle, Eye, EyeOff
} from 'lucide-react'

interface Usuario {
  id: number
  email: string
  nome_completo: string
  perfil: 'super_admin' | 'consultor'
  acesso_ia: number
  ativo: number
  empresa_cod: string
  empresa_nome: string
}

interface Empresa {
  id: number
  cod: string
  razao_social: string
  cnpj: string
  ativa: number
  total_usuarios: number
}

interface AdminPanelProps {
  onClose: () => void
  userToken?: string
}

export default function AdminPanel({ onClose, userToken }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'empresas'>('usuarios')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [empresaFilter, setEmpresaFilter] = useState('')
  
  // Estados de edição
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [userToChangePassword, setUserToChangePassword] = useState<Usuario | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Estados de cadastro
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [showNewEmpresaForm, setShowNewEmpresaForm] = useState(false)
  const [newUser, setNewUser] = useState({
    empresa_cod: '',
    email: '',
    nome_completo: '',
    senha: '',
    perfil: 'consultor' as 'super_admin' | 'consultor',
    acesso_ia: false
  })
  const [newEmpresa, setNewEmpresa] = useState({
    cod: '',
    razao_social: '',
    cnpj: ''
  })
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const API_URL = 'https://comlink-api.josimarmarianocel.workers.dev'

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [usersRes, empresasRes] = await Promise.all([
        fetch(`${API_URL}/admin/usuarios`),
        fetch(`${API_URL}/admin/empresas`)
      ])
      
      const usersData = await usersRes.json()
      const empresasData = await empresasRes.json()
      
      setUsuarios(usersData)
      setEmpresas(empresasData)
    } catch (error) {
      showMessage('error', 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // ==================== USUÁRIOS ====================

  const handleSaveUser = async () => {
    if (!editingUser) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/usuarios/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          nome_completo: editingUser.nome_completo,
          email: editingUser.email,
          perfil: editingUser.perfil,
          acesso_ia: editingUser.acesso_ia,
          ativo: editingUser.ativo
        })
      })

      const data = await response.json()

      if (data.sucesso) {
        showMessage('success', 'Usuário atualizado com sucesso')
        setEditingUser(null)
        carregarDados()
      } else {
        showMessage('error', data.mensagem || 'Erro ao atualizar usuário')
      }
    } catch (error) {
      showMessage('error', 'Erro ao atualizar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!userToChangePassword || !newPassword) return
    
    if (newPassword.length < 6) {
      showMessage('error', 'A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/usuarios/${userToChangePassword.id}/senha`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ senha: newPassword })
      })

      const data = await response.json()

      if (data.sucesso) {
        showMessage('success', 'Senha alterada com sucesso')
        setShowPasswordModal(false)
        setUserToChangePassword(null)
        setNewPassword('')
      } else {
        showMessage('error', data.mensagem || 'Erro ao alterar senha')
      }
    } catch (error) {
      showMessage('error', 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user: Usuario) => {
    if (!confirm(`Tem certeza que deseja excluir ${user.nome_completo}?`)) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/usuarios/${user.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${userToken}`
        }
      })

      const data = await response.json()

      if (data.sucesso) {
        showMessage('success', 'Usuário excluído com sucesso')
        carregarDados()
      } else {
        showMessage('error', data.mensagem || 'Erro ao excluir usuário')
      }
    } catch (error) {
      showMessage('error', 'Erro ao excluir usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.empresa_cod || !newUser.email || !newUser.nome_completo || !newUser.senha) {
      showMessage('error', 'Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/usuarios`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(newUser)
      })

      const data = await response.json()

      if (data.sucesso) {
        showMessage('success', 'Usuário cadastrado com sucesso')
        setShowNewUserForm(false)
        setNewUser({
          empresa_cod: '',
          email: '',
          nome_completo: '',
          senha: '',
          perfil: 'consultor',
          acesso_ia: false
        })
        carregarDados()
      } else {
        showMessage('error', data.mensagem || 'Erro ao cadastrar usuário')
      }
    } catch (error) {
      showMessage('error', 'Erro ao cadastrar usuário')
    } finally {
      setLoading(false)
    }
  }

  // ==================== EMPRESAS ====================

  const handleCreateEmpresa = async () => {
    if (!newEmpresa.cod || !newEmpresa.razao_social) {
      showMessage('error', 'COD e razão social são obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/admin/empresas`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(newEmpresa)
      })

      const data = await response.json()

      if (data.sucesso) {
        showMessage('success', 'Empresa cadastrada com sucesso')
        setShowNewEmpresaForm(false)
        setNewEmpresa({ cod: '', razao_social: '', cnpj: '' })
        carregarDados()
      } else {
        showMessage('error', data.mensagem || 'Erro ao cadastrar empresa')
      }
    } catch (error) {
      showMessage('error', 'Erro ao cadastrar empresa')
    } finally {
      setLoading(false)
    }
  }

  // ==================== FILTROS ====================

  const filteredUsers = usuarios.filter(user => {
    const matchSearch = user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.empresa_nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEmpresa = !empresaFilter || user.empresa_cod === empresaFilter
    return matchSearch && matchEmpresa
  })

  const groupedUsers = filteredUsers.reduce((acc, user) => {
    if (!acc[user.empresa_nome]) {
      acc[user.empresa_nome] = []
    }
    acc[user.empresa_nome].push(user)
    return acc
  }, {} as Record<string, Usuario[]>)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
              <p className="text-slate-400 text-sm mt-1">Gerenciar usuários e empresas</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'usuarios'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Usuários ({usuarios.length})
            </button>
            <button
              onClick={() => setActiveTab('empresas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'empresas'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Empresas ({empresas.length})
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
            'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar usuários..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={empresaFilter}
                  onChange={(e) => setEmpresaFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Todas empresas</option>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.cod}>{emp.razao_social}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Usuário
                </button>
              </div>

              {/* Users List */}
              {Object.entries(groupedUsers).map(([empresaNome, users]) => (
                <div key={empresaNome} className="space-y-3">
                  <h3 className="text-lg font-semibold text-cyan-400">{empresaNome}</h3>
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        {editingUser?.id === user.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingUser.nome_completo}
                                onChange={(e) => setEditingUser({ ...editingUser, nome_completo: e.target.value })}
                                className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                                placeholder="Nome completo"
                              />
                              <input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                                placeholder="Email"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <select
                                value={editingUser.perfil}
                                onChange={(e) => setEditingUser({ ...editingUser, perfil: e.target.value as 'super_admin' | 'consultor' })}
                                className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="consultor">Consultor</option>
                              </select>
                              <label className="flex items-center gap-2 text-white">
                                <input
                                  type="checkbox"
                                  checked={editingUser.acesso_ia === 1}
                                  onChange={(e) => setEditingUser({ ...editingUser, acesso_ia: e.target.checked ? 1 : 0 })}
                                  className="w-4 h-4"
                                />
                                Acesso IA
                              </label>
                              <label className="flex items-center gap-2 text-white">
                                <input
                                  type="checkbox"
                                  checked={editingUser.ativo === 1}
                                  onChange={(e) => setEditingUser({ ...editingUser, ativo: e.target.checked ? 1 : 0 })}
                                  className="w-4 h-4"
                                />
                                Ativo
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveUser}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-white font-medium">{user.nome_completo}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.perfil === 'super_admin' ? 'bg-purple-500/20 text-purple-300' :
                                  'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {user.perfil === 'super_admin' ? 'Super Admin' : 'Consultor'}
                                </span>
                                {user.acesso_ia === 1 && (
                                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">IA</span>
                                )}
                                {user.ativo === 0 && (
                                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">Inativo</span>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setUserToChangePassword(user)
                                  setShowPasswordModal(true)
                                }}
                                className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                title="Alterar senha"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              {user.perfil !== 'super_admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          )}

          {activeTab === 'empresas' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewEmpresaForm(true)}
                  className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nova Empresa
                </button>
              </div>

              <div className="grid gap-4">
                {empresas.map(empresa => (
                  <div key={empresa.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-white font-medium">{empresa.razao_social}</h4>
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                            COD: {empresa.cod}
                          </span>
                          {empresa.ativa === 1 ? (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Ativa</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">Inativa</span>
                          )}
                        </div>
                        <div className="flex gap-4 mt-2">
                          {empresa.cnpj && (
                            <p className="text-slate-400 text-sm">CNPJ: {empresa.cnpj}</p>
                          )}
                          <p className="text-slate-400 text-sm">{empresa.total_usuarios} usuários</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Nova Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Alterar Senha</h3>
            <p className="text-slate-400 mb-4">
              Usuário: <span className="text-white">{userToChangePassword?.nome_completo}</span>
            </p>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                disabled={loading || !newPassword}
                className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50"
              >
                Alterar Senha
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setUserToChangePassword(null)
                  setNewPassword('')
                }}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Usuário */}
      {showNewUserForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Novo Usuário</h3>
            <div className="space-y-4">
              <select
                value={newUser.empresa_cod}
                onChange={(e) => setNewUser({ ...newUser, empresa_cod: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              >
                <option value="">Selecione a empresa</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.cod}>{emp.razao_social}</option>
                ))}
              </select>
              <input
                type="text"
                value={newUser.nome_completo}
                onChange={(e) => setNewUser({ ...newUser, nome_completo: e.target.value })}
                placeholder="Nome completo"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
              <input
                type="password"
                value={newUser.senha}
                onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                placeholder="Senha (mínimo 6 caracteres)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
              <select
                value={newUser.perfil}
                onChange={(e) => setNewUser({ ...newUser, perfil: e.target.value as 'super_admin' | 'consultor' })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              >
                <option value="consultor">Consultor</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={newUser.acesso_ia}
                  onChange={(e) => setNewUser({ ...newUser, acesso_ia: e.target.checked })}
                  className="w-4 h-4"
                />
                Acesso à IA
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50"
              >
                Cadastrar
              </button>
              <button
                onClick={() => {
                  setShowNewUserForm(false)
                  setNewUser({
                    empresa_cod: '',
                    email: '',
                    nome_completo: '',
                    senha: '',
                    perfil: 'consultor',
                    acesso_ia: false
                  })
                }}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Empresa */}
      {showNewEmpresaForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Nova Empresa</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newEmpresa.cod}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, cod: e.target.value })}
                placeholder="COD (ex: JM234)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white uppercase"
              />
              <input
                type="text"
                value={newEmpresa.razao_social}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, razao_social: e.target.value })}
                placeholder="Razão Social"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
              <input
                type="text"
                value={newEmpresa.cnpj}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, cnpj: e.target.value })}
                placeholder="CNPJ (opcional)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateEmpresa}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50"
              >
                Cadastrar
              </button>
              <button
                onClick={() => {
                  setShowNewEmpresaForm(false)
                  setNewEmpresa({ cod: '', razao_social: '', cnpj: '' })
                }}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

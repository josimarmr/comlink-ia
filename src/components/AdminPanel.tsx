import { useState, useEffect } from 'react'
import { X, Users, Building2, Mail, Lock, Edit2, Trash2, Save, XCircle, Search, Filter } from 'lucide-react'

// ✅ INTERFACE CORRETA - Alinhada com a estrutura do banco
interface Usuario {
  id: number
  nome_completo: string      // ✅ Correto
  email: string              // ✅ Correto
  empresa_cod: string        // ✅ Correto (vem do JOIN)
  empresa_nome: string       // ✅ Correto (vem do JOIN)
  perfil: string            // ✅ Correto
  acesso_ia: number         // ✅ Correto
  ativo: number             // ✅ Correto
}

interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Usuario>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCod, setFilterCod] = useState<string>('all')
  const [empresas, setEmpresas] = useState<string[]>([])

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios')
      const data = await response.json()
      
      // ✅ API RETORNA ARRAY DIRETO (não tem .sucesso)
      if (Array.isArray(data)) {
        setUsuarios(data)
        // Extrair empresas únicas
        const codsUnicos = [...new Set(data.map((u: Usuario) => u.empresa_cod))]
        setEmpresas(codsUnicos)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      alert('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const iniciarEdicao = (usuario: Usuario) => {
    setEditingId(usuario.id)
    setEditData({
      nome_completo: usuario.nome_completo,  // ✅ Correto
      email: usuario.email,
      perfil: usuario.perfil,
      acesso_ia: usuario.acesso_ia,
      ativo: usuario.ativo
    })
  }

  const cancelarEdicao = () => {
    setEditingId(null)
    setEditData({})
  }

  const salvarEdicao = async (id: number) => {
    try {
      const response = await fetch(`https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      const data = await response.json()

      if (data.sucesso) {
        alert('✅ Usuário atualizado com sucesso!')
        setEditingId(null)
        setEditData({})
        carregarUsuarios()
      } else {
        alert('❌ ' + (data.mensagem || 'Erro ao atualizar usuário'))
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('❌ Erro ao salvar usuário')
    }
  }

  const alterarSenha = async (id: number) => {
    const novaSenha = prompt('Digite a nova senha (mínimo 6 caracteres):')
    if (!novaSenha) return

    if (novaSenha.length < 6) {
      alert('❌ A senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
      const response = await fetch(`https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios/${id}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: novaSenha })
      })

      const data = await response.json()

      if (data.sucesso) {
        alert('✅ Senha alterada com sucesso!')
      } else {
        alert('❌ ' + (data.mensagem || 'Erro ao alterar senha'))
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      alert('❌ Erro ao alterar senha')
    }
  }

  const excluirUsuario = async (id: number, nome: string) => {
    if (!confirm(`❌ Tem certeza que deseja excluir o usuário "${nome}"?`)) return

    try {
      const response = await fetch(`https://comlink-api.josimarmarianocel.workers.dev/admin/usuarios/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.sucesso) {
        alert('✅ Usuário excluído com sucesso!')
        carregarUsuarios()
      } else {
        alert('❌ ' + (data.mensagem || 'Erro ao excluir usuário'))
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('❌ Erro ao excluir usuário')
    }
  }

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchSearch = 
      usuario.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.empresa_nome.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchEmpresa = filterCod === 'all' || usuario.empresa_cod === filterCod

    return matchSearch && matchEmpresa
  })

  // Agrupar por empresa
  const usuariosPorEmpresa = empresas.reduce((acc, cod) => {
    acc[cod] = usuariosFiltrados.filter(u => u.empresa_cod === cod)
    return acc
  }, {} as Record<string, Usuario[]>)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
                <p className="text-slate-400 text-sm">Gerenciar usuários do sistema</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="flex gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou empresa..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Filtro por Empresa */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterCod}
                onChange={(e) => setFilterCod(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 appearance-none cursor-pointer"
              >
                <option value="all">Todas as Empresas</option>
                {empresas.map(cod => (
                  <option key={cod} value={cod}>{cod.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-white">{usuariosFiltrados.length}</p>
            </div>
            <div className="flex-1 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">Empresas</p>
              <p className="text-2xl font-bold text-white">{empresas.length}</p>
            </div>
            <div className="flex-1 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-400">
                {usuariosFiltrados.filter(u => u.ativo === 1).length}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-cyan-500"></div>
              <p className="text-slate-400 mt-4">Carregando usuários...</p>
            </div>
          ) : filterCod === 'all' ? (
            /* Agrupado por Empresa */
            <div className="space-y-6">
              {empresas.map(cod => {
                const usuariosEmpresa = usuariosPorEmpresa[cod]
                if (usuariosEmpresa.length === 0) return null

                const nomeEmpresa = usuariosEmpresa[0]?.empresa_nome || cod

                return (
                  <div key={cod} className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <Building2 className="w-5 h-5 text-cyan-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{nomeEmpresa}</h3>
                        <p className="text-xs text-slate-400">COD: {cod.toUpperCase()}</p>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {usuariosEmpresa.length} usuário{usuariosEmpresa.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {usuariosEmpresa.map(usuario => (
                        <UsuarioCard
                          key={usuario.id}
                          usuario={usuario}
                          isEditing={editingId === usuario.id}
                          editData={editData}
                          setEditData={setEditData}
                          onEdit={iniciarEdicao}
                          onSave={salvarEdicao}
                          onCancel={cancelarEdicao}
                          onChangePassword={alterarSenha}
                          onDelete={excluirUsuario}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Lista Simples (quando filtrado) */
            <div className="space-y-2">
              {usuariosFiltrados.map(usuario => (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  isEditing={editingId === usuario.id}
                  editData={editData}
                  setEditData={setEditData}
                  onEdit={iniciarEdicao}
                  onSave={salvarEdicao}
                  onCancel={cancelarEdicao}
                  onChangePassword={alterarSenha}
                  onDelete={excluirUsuario}
                />
              ))}
            </div>
          )}

          {usuariosFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de Card do Usuário
interface UsuarioCardProps {
  usuario: Usuario
  isEditing: boolean
  editData: Partial<Usuario>
  setEditData: (data: Partial<Usuario>) => void
  onEdit: (usuario: Usuario) => void
  onSave: (id: number) => void
  onCancel: () => void
  onChangePassword: (id: number) => void
  onDelete: (id: number, nome: string) => void
}

function UsuarioCard({
  usuario,
  isEditing,
  editData,
  setEditData,
  onEdit,
  onSave,
  onCancel,
  onChangePassword,
  onDelete
}: UsuarioCardProps) {
  if (isEditing) {
    return (
      <div className="p-4 bg-slate-800/50 border-2 border-cyan-500 rounded-xl space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={editData.nome_completo || ''}
              onChange={(e) => setEditData({ ...editData, nome_completo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Perfil</label>
            <select
              value={editData.perfil || 'usuario'}
              onChange={(e) => setEditData({ ...editData, perfil: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="usuario">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Status</label>
            <select
              value={editData.ativo || 1}
              onChange={(e) => setEditData({ ...editData, ativo: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value={1}>Ativo</option>
              <option value={0}>Inativo</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Acesso IA</label>
            <select
              value={editData.acesso_ia || 1}
              onChange={(e) => setEditData({ ...editData, acesso_ia: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value={1}>Liberado</option>
              <option value={0}>Bloqueado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSave(usuario.id)}
            className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{usuario.nome_completo}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              usuario.ativo === 1 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {usuario.ativo === 1 ? 'Ativo' : 'Inativo'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              usuario.perfil === 'admin'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {usuario.perfil}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              usuario.acesso_ia === 1
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {usuario.acesso_ia === 1 ? '🤖 IA' : '🚫 Sem IA'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4" />
              {usuario.email}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="w-4 h-4" />
              {usuario.empresa_nome}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(usuario)}
            className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangePassword(usuario.id)}
            className="p-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all"
            title="Alterar Senha"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(usuario.id, usuario.nome_completo)}
            className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

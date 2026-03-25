'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUsers, createUser, updateUser, updatePassword, deleteUser } from '@/lib/actions/users'
import { useSession } from 'next-auth/react'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })
  // Add user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
  })

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading('create')
    setError(null)
    try {
      await createUser(newUser)
      setShowAddModal(false)
      setNewUser({ name: '', email: '', password: '', role: 'editor' })
      await fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setActionLoading(id)
    try {
      await updateUser(id, { isActive: !currentActive })
      await fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateRole = async (id: string) => {
    setActionLoading(id)
    try {
      await updateUser(id, { role: editRole })
      setEditingUser(null)
      await fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetPassword = async (id: string) => {
    setActionLoading(id)
    try {
      await updatePassword(id, newPassword)
      setShowPasswordModal(null)
      setNewPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const requestDelete = (id: string) => {
    setConfirmDelete({ isOpen: true, id })
  }

  const handleDeleteUser = async () => {
    const { id } = confirmDelete
    if (!id) return
    setConfirmDelete({ isOpen: false, id: null })
    setActionLoading(id)
    try {
      await deleteUser(id)
      await fetchUsers()
      toast.success('User deleted successfully')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'superadmin') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
          <ShieldCheck className="w-3 h-3" />
          Superadmin
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
        <Shield className="w-3 h-3" />
        Editor
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            User Management
          </h1>
          <p className="text-gray-500 mt-2">Manage admin panel users and their roles.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Name</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const isSelf = session?.user?.id === user.id
                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name || '—'}
                      {isSelf && (
                        <span className="ml-2 text-xs text-gray-400">(you)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="editor">Editor</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        getRoleBadge(user.role)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(user.id)
                            setEditRole(user.role)
                          }}
                          title="Edit role"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={actionLoading === user.id}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          {user.isActive ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordModal(user.id)
                            setNewPassword('')
                          }}
                          title="Reset password"
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestDelete(user.id)}
                          disabled={isSelf || actionLoading === user.id}
                          title={isSelf ? 'Cannot delete yourself' : 'Delete user'}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p>No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50"
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50"
                >
                  <option value="editor">Editor</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="w-full flex justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-70 transition-colors"
                >
                  {actionLoading === 'create' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
              <button onClick={() => setShowPasswordModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleResetPassword(showPasswordModal)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading === showPasswordModal}
                  className="w-full flex justify-center rounded-xl bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 disabled:opacity-70 transition-colors"
                >
                  {actionLoading === showPasswordModal ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </div>
  )
}

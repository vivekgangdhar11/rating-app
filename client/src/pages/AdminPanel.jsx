import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  
  // Search and filter states
  const [userSearch, setUserSearch] = useState('')
  const [storeSearch, setStoreSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  const load = async () => {
    try {
      const [u, s] = await Promise.all([
        api.get('/users'),
        api.get('/stores'),
      ])
      setUsers(u.data)
      setStores(s.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createStore = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess('')
    
    // Validation
    if (newStore.name.length < 20) {
      setCreateError('Store name must be at least 20 characters')
      return
    }
    if (newStore.address.length > 400) {
      setCreateError('Address must be less than 400 characters')
      return
    }
    
    try {
      const payload = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
      }
      if (newStore.ownerId && newStore.ownerId.trim() !== '') {
        payload.ownerId = Number(newStore.ownerId)
      }
      await api.post('/admin/stores', payload)
      setNewStore({ name: '', email: '', address: '', ownerId: '' })
      setCreateSuccess('Store created successfully')
      await load()
    } catch (e) {
      const apiMsg = e.response?.data?.message
      const valErrors = e.response?.data?.errors
      if (valErrors && Array.isArray(valErrors)) {
        setCreateError(valErrors.map(x => x.msg).join(', '))
      } else if (apiMsg) {
        setCreateError(apiMsg)
      } else {
        setCreateError('Failed to create store')
      }
    }
  }

  const deleteStore = async (id) => {
    if (!confirm('Delete this store?')) return
    try {
      await api.delete(`/stores/${id}`)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete store')
    }
  }

  // Filter and sort functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.address.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = !userRoleFilter || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredStores = stores.filter(store => {
    return store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
           store.email.toLowerCase().includes(storeSearch.toLowerCase()) ||
           store.address.toLowerCase().includes(storeSearch.toLowerCase())
  })

  const sortData = (data, field, direction) => {
    if (!field) return data
    return [...data].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedUsers = sortData(filteredUsers, sortField, sortDirection)
  const sortedStores = sortData(filteredStores, sortField, sortDirection)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
    </div>
  )

  const ownerOptions = users.filter(u => u.role === 'owner')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
            <span className="text-3xl">⚙️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Admin Panel</h1>
          <p className="mt-2 text-lg text-gray-600">Manage stores and users with powerful tools</p>
        </div>

        {/* Create Store Form */}
        <div className="card p-8 mb-8">
          <div className="card-header">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🏪</span>
              Create New Store
            </h2>
            <p className="text-gray-600 mt-1">Add a new store to the platform</p>
          </div>
          <form onSubmit={createStore} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏪 Store Name *
                </label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter store name (min 20 characters)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email *
                </label>
                <input
                  type="email"
                  value={newStore.email}
                  onChange={e => setNewStore({ ...newStore, email: e.target.value })}
                  className="input-field"
                  placeholder="store@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏠 Address *
              </label>
              <input
                type="text"
                value={newStore.address}
                onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                className="input-field"
                placeholder="Enter store address (max 400 characters)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Store Owner
              </label>
              <select
                value={newStore.ownerId}
                onChange={e => setNewStore({ ...newStore, ownerId: e.target.value })}
                className="input-field"
              >
                <option value="">Self (admin)</option>
                {ownerOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            {createError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                <span className="mr-2">⚠️</span>
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                <span className="mr-2">✅</span>
                {createSuccess}
              </div>
            )}
            <button
              type="submit"
              className="btn-primary text-lg py-4 px-8"
            >
              🚀 Create Store
            </button>
          </form>
        </div>

        {/* Stores Section */}
        <div className="card p-8 mb-8">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🏪</span>
                Stores Management
              </h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="🔍 Search stores..."
                  value={storeSearch}
                  onChange={e => setStoreSearch(e.target.value)}
                  className="input-field w-64"
                />
              </div>
            </div>
            <p className="text-gray-600 mt-1">Manage all stores on the platform</p>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      🏪 Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      📧 Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center">
                      🏠 Address {sortField === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => handleSort('ownerId')}
                  >
                    <div className="flex items-center">
                      👤 Owner ID {sortField === 'ownerId' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    onClick={() => handleSort('average_rating')}
                  >
                    <div className="flex items-center">
                      ⭐ Rating {sortField === 'average_rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ⚙️ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedStores.map((store, index) => (
                  <tr key={store.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{store.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{store.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{store.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{store.ownerId || 'Admin'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-lg">⭐</span>
                        <span className="ml-1 text-sm font-semibold text-gray-900">{store.average_rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({store.total_ratings})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteStore(store.id)}
                        className="btn-danger text-sm py-2 px-4"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Section */}
        <div className="card p-8">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">👥</span>
                Users Management
              </h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="🔍 Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="input-field w-64"
                />
                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value)}
                  className="input-field w-40"
                >
                  <option value="">All Roles</option>
                  <option value="user">👤 User</option>
                  <option value="owner">🏪 Owner</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>
            </div>
            <p className="text-gray-600 mt-1">Manage all users on the platform</p>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      🆔 ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      👤 Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      📧 Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center">
                      🏠 Address {sortField === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      🎭 Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{user.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{user.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300' :
                        user.role === 'owner' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                      }`}>
                        {user.role === 'admin' ? '⚙️ Admin' : user.role === 'owner' ? '🏪 Owner' : '👤 User'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}



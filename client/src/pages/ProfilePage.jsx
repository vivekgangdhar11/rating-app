import React, { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import api from '../utils/api.js'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (form.newPassword !== form.confirmPassword) {
      setErr('Password confirmation does not match new password')
      return
    }
    setLoading(true)
    try {
      // Supports both endpoints; prefer PUT
      try {
        await api.put('/users/password', {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        })
      } catch (e1) {
        // Fallback to POST /update-password if needed
        await api.post('/users/update-password', {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        })
      }
      setMsg('Password updated successfully')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      const apiMsg = e.response?.data?.message
      const valErrors = e.response?.data?.errors
      if (valErrors && Array.isArray(valErrors)) {
        setErr(valErrors.map(x => x.msg).join(', '))
      } else if (apiMsg) {
        setErr(apiMsg)
      } else {
        setErr('Error updating password')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Information */}
        <div className="card p-8 mb-8">
          <div className="card-header">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">👤</span>
              Account Information
            </h2>
            <p className="text-gray-600 mt-1">Your personal details</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Name</label>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🎭 Role</label>
              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full mt-2 ${
                user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300' :
                user.role === 'owner' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
                'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
              }`}>
                {user.role === 'admin' ? '⚙️ Admin' : user.role === 'owner' ? '🏪 Owner' : '👤 User'}
              </span>
            </div>
            {user.address && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🏠 Address</label>
                <p className="text-lg font-medium text-gray-900">{user.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Password Update */}
        <div className="card p-8">
          <div className="card-header">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🔒</span>
              Update Password
            </h2>
            <p className="text-gray-600 mt-1">Change your account password</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-6 mt-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={form.currentPassword}
                onChange={onChange}
                placeholder="Enter your current password"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                🔑 New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={form.newPassword}
                onChange={onChange}
                placeholder="Enter your new password"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                ✅ Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Confirm your new password"
                className="input-field"
              />
            </div>

            {err && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                <span className="mr-2">⚠️</span>
                {err}
              </div>
            )}

            {msg && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                <span className="mr-2">✅</span>
                {msg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  '🔒 Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



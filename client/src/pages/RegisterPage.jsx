import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if ((form.name || '').trim().length < 20) {
      setLoading(false)
      setError('Minimum length 20 characters required for name')
      return
    }
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      const valErrors = err.response?.data?.errors
      if (valErrors && Array.isArray(valErrors)) {
        const nameErr = valErrors.find(x => x.path === 'name')
        if (nameErr) {
          setError('Minimum length 20 characters required')
        } else {
          setError(valErrors.map(x => x.msg).join(', '))
        }
      } else {
        setError(err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join RatingApp!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Create your account and start rating
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-10 px-8">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter your full name (min 20 characters)"
                  className="input-field pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="input-field pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={onChange}
                  placeholder="Create a strong password"
                  className="input-field pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                🏠 Address
              </label>
              <div className="relative">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Enter your address (optional)"
                  className="input-field pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🏠</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                🎭 Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="input-field pl-12 appearance-none"
                >
                  <option value="user">👤 User</option>
                  <option value="owner">🏪 Store Owner</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🎭</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  '🎉 Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



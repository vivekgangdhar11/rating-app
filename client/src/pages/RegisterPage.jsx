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
    <div className="page auth-page">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Name<input name="name" value={form.name} onChange={onChange} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
        <label>Address<input name="address" value={form.address} onChange={onChange} /></label>
        <label>Role
          <select name="role" value={form.role} onChange={onChange}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <div>Already have an account? <Link to="/login">Login</Link></div>
    </div>
  )
}



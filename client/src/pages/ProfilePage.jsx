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
    <div className="page">
      <h2>Profile</h2>
      <div className="card">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        {user.address && <div><strong>Address:</strong> {user.address}</div>}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Update Password</h3>
        <form onSubmit={onSubmit} className="form">
          <label>Current Password
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={onChange} required />
          </label>
          <label>New Password
            <input type="password" name="newPassword" value={form.newPassword} onChange={onChange} required />
          </label>
          <label>Confirm New Password
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required />
          </label>
          {err && <div className="error">{err}</div>}
          {msg && <div className="success">{msg}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  )
}



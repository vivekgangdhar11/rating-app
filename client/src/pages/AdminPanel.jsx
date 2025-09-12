import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' })

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
    try {
      await api.post('/stores', newStore)
      setNewStore({ name: '', email: '', address: '', owner_id: '' })
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create store')
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

  if (loading) return <div className="page">Loading...</div>
  if (error) return <div className="page error">{error}</div>

  const ownerOptions = users.filter(u => u.role === 'owner')

  return (
    <div className="page">
      <h2>Admin Panel</h2>

      <section>
        <h3>Create Store</h3>
        <form onSubmit={createStore} className="form">
          <label>Name<input value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} required /></label>
          <label>Address<input value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} required /></label>
          <label>Owner
            <select value={newStore.owner_id} onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })}>
              <option value="">Self (admin)</option>
              {ownerOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Stores</h3>
        <ul className="list">
          {stores.map(s => (
            <li key={s.id} className="card row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="title">{s.name}</div>
                <div>{s.email} · {s.address}</div>
                <div>Avg: {s.average_rating} ({s.total_ratings})</div>
              </div>
              <div>
                <button onClick={() => deleteStore(s.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Users</h3>
        <ul className="list">
          {users.map(u => (
            <li key={u.id} className="card">
              <div className="title">{u.name}</div>
              <div>{u.email} · {u.role}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}



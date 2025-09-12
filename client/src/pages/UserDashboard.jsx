import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/stores')
      .then(res => setStores(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load stores'))
      .finally(() => setLoading(false))
  }, [])

  const submitRating = async (storeId, score) => {
    try {
      await api.post('/ratings', { storeId, score })
      const updated = await api.get('/stores')
      setStores(updated.data)
      alert('Rating submitted')
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit rating')
    }
  }

  if (loading) return <div className="page">Loading...</div>
  if (error) return <div className="page error">{error}</div>

  return (
    <div className="page">
      <h2>Stores</h2>
      <ul className="list">
        {stores.map(store => (
          <li key={store.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="title">{store.name}</div>
                <div>{store.address}</div>
                <div>Average: {store.average_rating} ({store.total_ratings})</div>
              </div>
              <div>
                <select onChange={(e) => submitRating(store.id, parseInt(e.target.value))} defaultValue="">
                  <option value="" disabled>Rate</option>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}



import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responseMap, setResponseMap] = useState({})

  useEffect(() => {
    api.get('/owners/ratings')
      .then(res => setRatings(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load ratings'))
      .finally(() => setLoading(false))
  }, [])

  const sendResponse = async (ratingId) => {
    const text = responseMap[ratingId]
    if (!text) return
    try {
      await api.post(`/owners/ratings/${ratingId}/respond`, { response: text })
      const refreshed = await api.get('/owners/ratings')
      setRatings(refreshed.data)
      setResponseMap({ ...responseMap, [ratingId]: '' })
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to respond')
    }
  }

  if (loading) return <div className="page">Loading...</div>
  if (error) return <div className="page error">{error}</div>

  return (
    <div className="page">
      <h2>Your Stores' Ratings</h2>
      <ul className="list">
        {ratings.map(r => (
          <li key={r.id} className="card">
            <div className="title">{r.store_name}</div>
            <div>
              <strong>{r.user_name}</strong>: {r.score} ⭐
              <div style={{ marginTop: 8 }}>
                <textarea
                  placeholder="Respond to this rating"
                  value={responseMap[r.id] || ''}
                  onChange={(e) => setResponseMap({ ...responseMap, [r.id]: e.target.value })}
                />
                <button onClick={() => sendResponse(r.id)}>Send Response</button>
              </div>
              {r.owner_response && (
                <div style={{ marginTop: 8 }}>
                  <em>Your response:</em> {r.owner_response}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}



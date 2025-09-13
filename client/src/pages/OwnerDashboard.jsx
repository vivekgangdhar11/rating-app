import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([])
  const [storeStats, setStoreStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responseMap, setResponseMap] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ratingsRes, storesRes] = await Promise.all([
        api.get('/owners/ratings'),
        api.get('/stores')
      ])
      setRatings(ratingsRes.data)
      
      // Calculate store statistics
      const stats = {}
      storesRes.data.forEach(store => {
        stats[store.id] = {
          name: store.name,
          averageRating: store.average_rating,
          totalRatings: store.total_ratings
        }
      })
      setStoreStats(stats)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const sendResponse = async (ratingId) => {
    const text = responseMap[ratingId]
    if (!text) return
    try {
      await api.post(`/owners/ratings/${ratingId}/respond`, { response: text })
      await loadData()
      setResponseMap({ ...responseMap, [ratingId]: '' })
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to respond')
    }
  }

  // Filter and sort functions
  const filteredRatings = ratings.filter(rating => {
    return rating.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           rating.store_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const sortedRatings = sortData(filteredRatings, sortField, sortDirection)

  // Group ratings by store
  const ratingsByStore = {}
  sortedRatings.forEach(rating => {
    if (!ratingsByStore[rating.store_id]) {
      ratingsByStore[rating.store_id] = []
    }
    ratingsByStore[rating.store_id].push(rating)
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Store Owner Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your store ratings and respond to customers</p>
        </div>

        {/* Store Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {Object.entries(storeStats).map(([storeId, stats]) => (
            <div key={storeId} className="card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{stats.name}</h3>
                <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-full p-2">
                  <span className="text-white text-lg">🏪</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Average Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-2xl">⭐</span>
                      <span className="ml-2 font-bold text-xl text-gray-900">{stats.averageRating}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total Ratings:</span>
                    <span className="font-bold text-xl text-gray-900">{stats.totalRatings}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">💬</span>
              Customer Ratings
            </h2>
            <input
              type="text"
              placeholder="🔍 Search ratings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field w-80"
            />
          </div>
        </div>

        {/* Ratings by Store */}
        {Object.entries(ratingsByStore).map(([storeId, storeRatings]) => (
          <div key={storeId} className="card p-8 mb-8">
            <div className="card-header">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">⭐</span>
                {storeStats[storeId]?.name || 'Store'} Ratings
              </h3>
              <p className="text-gray-600 mt-1">Customer feedback and responses</p>
            </div>
            <div className="space-y-6 mt-6">
              {storeRatings.map(rating => (
                <div key={rating.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-orange-200 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg text-gray-900">{rating.user_name}</span>
                        <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-3 py-1">
                          <span className="text-yellow-400 text-xl">⭐</span>
                          <span className="ml-2 font-bold text-lg text-gray-900">{rating.score}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <span className="mr-2">📅</span>
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {rating.owner_response && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                      <p className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                        <span className="mr-2">💬</span>
                        Your Response:
                      </p>
                      <p className="text-sm text-blue-800">{rating.owner_response}</p>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-gray-100 pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {rating.owner_response ? '🔄 Update Response:' : '💬 Respond to this rating:'}
                    </label>
                    <textarea
                      placeholder="Write your response..."
                      value={responseMap[rating.id] || ''}
                      onChange={(e) => setResponseMap({ ...responseMap, [rating.id]: e.target.value })}
                      className="input-field"
                      rows="3"
                    />
                    <button
                      onClick={() => sendResponse(rating.id)}
                      disabled={!responseMap[rating.id]}
                      className="btn-primary mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rating.owner_response ? '🔄 Update Response' : '💬 Send Response'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sortedRatings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No ratings found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}



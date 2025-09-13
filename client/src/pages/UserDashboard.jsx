import React, { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [userRatings, setUserRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [storesRes, ratingsRes] = await Promise.all([
        api.get('/stores'),
        api.get('/ratings')
      ])
      setStores(storesRes.data)
      
      // Create a map of user's ratings by store ID
      const ratingsMap = {}
      ratingsRes.data.forEach(rating => {
        ratingsMap[rating.store_id] = rating.score
      })
      setUserRatings(ratingsMap)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const submitRating = async (storeId, score) => {
    try {
      await api.post('/ratings', { storeId, score })
      setUserRatings({ ...userRatings, [storeId]: score })
      const updated = await api.get('/stores')
      setStores(updated.data)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit rating')
    }
  }

  const updateRating = async (storeId, score) => {
    try {
      await api.put(`/ratings/${storeId}`, { score })
      setUserRatings({ ...userRatings, [storeId]: score })
      const updated = await api.get('/stores')
      setStores(updated.data)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update rating')
    }
  }

  // Filter and sort functions
  const filteredStores = stores.filter(store => {
    return store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           store.address.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
            <span className="text-3xl">⭐</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Store Ratings</h1>
          <p className="mt-2 text-lg text-gray-600">Discover and rate amazing stores</p>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🔍</span>
              Search Stores
            </h2>
            <input
              type="text"
              placeholder="🔍 Search stores..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field w-80"
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedStores.map(store => (
            <div key={store.id} className="card p-6 hover:scale-105 transition-all duration-300 group">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{store.name}</h3>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2">
                    <span className="text-white text-lg">⭐</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 flex items-center">
                  <span className="mr-2">🏠</span>
                  {store.address}
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Average Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">⭐</span>
                      <span className="ml-2 font-bold text-lg text-gray-900">{store.average_rating}</span>
                      <span className="ml-2 text-gray-500 text-sm">({store.total_ratings} ratings)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t-2 border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">Your Rating:</span>
                  <div className="flex items-center space-x-1">
                    {userRatings[store.id] ? (
                      <>
                        <span className="text-yellow-400 text-xl">⭐</span>
                        <span className="font-bold text-lg text-gray-900">{userRatings[store.id]}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm bg-gray-100 px-2 py-1 rounded-full">Not rated</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {userRatings[store.id] ? '🔄 Update Rating:' : '⭐ Rate this store:'}
                  </label>
                  <select 
                    onChange={(e) => {
                      const score = parseInt(e.target.value)
                      if (userRatings[store.id]) {
                        updateRating(store.id, score)
                      } else {
                        submitRating(store.id, score)
                      }
                    }} 
                    value={userRatings[store.id] || ''}
                    className="input-field"
                  >
                    <option value="" disabled>Select rating</option>
                    {[1,2,3,4,5].map(v => (
                      <option key={v} value={v}>{v} ⭐</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stores found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}



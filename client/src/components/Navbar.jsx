import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl border-b-4 border-blue-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-white rounded-full p-2 mr-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-200">
                RatingApp
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:scale-105"
                >
                  📊 Dashboard
                </Link>
                {(user.role === 'owner' || user.role === 'admin') && (
                  <Link
                    to="/owner"
                    className="text-white hover:text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  >
                    🏪 Owner Panel
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-white hover:text-yellow-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:scale-105"
                >
                  👤 Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



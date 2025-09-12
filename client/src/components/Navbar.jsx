import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">RatingApp</Link>
      </div>
      <div className="nav-right" style={{ display: 'flex', gap: 12 }}>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {(user.role === 'owner' || user.role === 'admin') && (
              <Link to="/owner">Owner</Link>
            )}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}



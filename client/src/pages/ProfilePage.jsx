import React from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function ProfilePage() {
  const { user } = useAuth()

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
    </div>
  )
}



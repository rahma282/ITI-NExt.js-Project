'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetch('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          window.location.href = '/login'
        }
        return res.json()
      })
      .then(data => {
        setUser(data)
        setName(data.name)
        setEmail(data.email)
      })
  }, [])

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      const updated = await res.json()
      setUser(updated)
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    await fetch('/api/auth/profile', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    localStorage.removeItem('token')
    window.location.href = '/register'
  }

  if (!user)
    return <div className="p-6 text-center text-gray-700 dark:text-gray-200">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md transition-all">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Welcome, {user.name}
        </h1>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

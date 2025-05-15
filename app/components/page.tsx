'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] })

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-900 dark:to-blue-800 text-white shadow-lg z-50 relative">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Link
            href="/"
            className={`text-3xl font-bold ${dancingScript.className} text-orange-300`}
          >
            PostHub 
          </Link>

          <div className="flex space-x-8">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="font-medium hover:text-indigo-200 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-medium hover:text-red-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-medium hover:text-indigo-200 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

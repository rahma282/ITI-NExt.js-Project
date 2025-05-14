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
    <nav className="bg-white dark:bg-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_10px_rgba(255,255,255,0.05)] z-50 relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link
          href="/"
          className={`text-3xl font-bold ${dancingScript.className} text-gray-900 dark:text-white`}
        >
          Blog
        </Link>

        <div className="flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 font-medium hover:text-red-800 dark:hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
